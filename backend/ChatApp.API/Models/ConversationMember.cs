using System.ComponentModel.DataAnnotations.Schema;

namespace ChatApp.API.Models
{
    [Table("conversation_members")]
    public class ConversationMember
    {
        [Column("conversation_id")]
        public int ConversationId { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("joined_at")]
        public DateTime JoinedAt { get; set; }

        public Conversation Conversation { get; set; }
        public User User { get; set; }
    }
}