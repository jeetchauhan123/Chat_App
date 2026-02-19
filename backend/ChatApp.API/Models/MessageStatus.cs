namespace ChatApp.API.Models
{
    public class MessageStatus
    {
        public int MessageId { get; set; }
        public int UserId { get; set; }
        public string Status { get; set; } = null!;
        public DateTime UpdatedAt { get; set; }
    }
}
