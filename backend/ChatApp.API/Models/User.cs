namespace ChatApp.API.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public string? Name { get; set; }
        public string? StatusMessage { get; set; }
        public bool IsOnline { get; set; }
        public DateTime? LastSeen { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<ConversationMember> ConversationMembers { get; set; }
        public ICollection<Message> SentMessages { get; set; }
        public ICollection<MessageStatus> MessageStatuses { get; set; }
    }
}
