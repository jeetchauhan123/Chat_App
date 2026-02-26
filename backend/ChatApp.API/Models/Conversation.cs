namespace ChatApp.API.Models
{
    public class Conversation
    {
        public int ConversationId { get; set; }

        public string ConversationType { get; set; }

        public int? LastMessageId { get; set; }

        public DateTime CreatedAt { get; set; }

        public ICollection<ConversationMember> ConversationMembers { get; set; }
        public ICollection<Message> Messages { get; set; }
        public Message? LastMessage { get; set; }
    }
}