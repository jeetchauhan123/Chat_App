using ChatApp.API.Data;
using ChatApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace ChatApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        // Temporary OTP storage (in-memory)
        private static Dictionary<string, string> _otpStorage = new();

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // STEP 1: Generate OTP
        [HttpPost("generate-otp")]
        public IActionResult GenerateOtp([FromBody] EmailRequest request)
        {
            var email = request.Email;

            var random = new Random();
            var otp = random.Next(1000, 9999).ToString();

            _otpStorage[email] = otp;

            Console.WriteLine($"OTP for {email} is: {otp}");

            return Ok(new { message = "OTP generated" });
        }

        // STEP 2: Verify OTP and Login/Register
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] OtpRequest request)
        {
            if (!_otpStorage.ContainsKey(request.Email) ||
                _otpStorage[request.Email] != request.Otp)
            {
                return BadRequest("Invalid OTP");
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
            {
                user = new User
                {
                    Email = request.Email,
                    Name = request.Email.Split('@')[0],
                    CreatedAt = DateTime.UtcNow,
                    IsOnline = true
                };

                _context.Users.Add(user);
            }
            else
            {
                user.IsOnline = true;
            }

            await _context.SaveChangesAsync();

            _otpStorage.Remove(request.Email); // remove after success


            // ===== JWT PART =====
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("THIS_IS_MY_SUPER_SECRET_KEY_1234567890123456")
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new
            {
                token = jwt,
                user = user
            });
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers(string query)
        {
            var users = await _context.Users
                .Where(u => u.Name.Contains(query))
                .ToListAsync();

            return Ok(users);
        }


        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Console.WriteLine(User.Identity?.IsAuthenticated);
            if (userId == null)
                return Unauthorized();

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId.ToString() == userId);

            if (user == null)
                return NotFound();

            return Ok(user);
        }
    }

    // DTO class
    public class OtpRequest
    {
        public string Email { get; set; }
        public string Otp { get; set; }
    }
    // DTO class for email
    public class EmailRequest
    {
        public string Email { get; set; }
    }
}