namespace ChatApp.API.Models
{
    public class Conversation
    {
        public int ConversationId { get; set; }
        public string ConversationType { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}
