using ChatApp.API.Data;
using ChatApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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