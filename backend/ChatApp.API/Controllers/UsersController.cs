using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetUsers()
        {
            return Ok(new[]
            {
                new { id = 1, name = "Alice" },
                new { id = 2, name = "Bob" }
            });
        }

        [HttpPost]
        public IActionResult CreateUser([FromBody] User user)
        {
            return Ok(user);
        }
    }
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
