namespace ChatApp.API.Models
{
    public class Message
    {
        public int MessageId { get; set; }
        public int ConversationId { get; set; }
        public int SenderId { get; set; }
        public string Content { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}
