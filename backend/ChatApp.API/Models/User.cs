namespace ChatApp.API.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Email { get; set; } = null!;
        public string? Name { get; set; }
        public string? Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
