namespace ChatApp.API.Models
{
    public class ConversationMember
    {
        public int ConversationId { get; set; }
        public int UserId { get; set; }
        public DateTime JoinedAt { get; set; }
    }
}
