using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChatApp.API.Data;
using ChatApp.API.Models;

namespace ChatApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConversationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ConversationsController(AppDbContext context)
        {
            _context = context;
        }

        // ============================================
        // 1️⃣ GET or CREATE private conversation
        // ============================================
        [HttpPost("private")]
        public async Task<IActionResult> GetOrCreatePrivateConversation([FromBody] PrivateConversationRequest request)
        {
            var user1 = request.User1Id;
            var user2 = request.User2Id;

            // find conversation where both users exist
            var conversation = await _context.Conversations
                .Where(c => c.ConversationType == "private")
                .Where(c =>
                    _context.ConversationMembers
                        .Where(cm => cm.UserId == user1)
                        .Select(cm => cm.ConversationId)
                        .Contains(c.ConversationId)
                    &&
                    _context.ConversationMembers
                        .Where(cm => cm.UserId == user2)
                        .Select(cm => cm.ConversationId)
                        .Contains(c.ConversationId)
                )
                .FirstOrDefaultAsync();

            if (conversation != null)
            {
                return Ok(conversation);
            }

            // create new conversation
            conversation = new Conversation
            {
                ConversationType = "private",
                CreatedAt = DateTime.UtcNow
            };

            _context.Conversations.Add(conversation);
            await _context.SaveChangesAsync();

            // add members
            _context.ConversationMembers.AddRange(
                new ConversationMember
                {
                    ConversationId = conversation.ConversationId,
                    UserId = user1,
                    JoinedAt = DateTime.UtcNow
                },
                new ConversationMember
                {
                    ConversationId = conversation.ConversationId,
                    UserId = user2,
                    JoinedAt = DateTime.UtcNow
                }
            );

            await _context.SaveChangesAsync();

            return Ok(conversation);
        }

        // ============================================
        // 2️⃣ GET messages for conversation
        // ============================================
        [HttpGet("{conversationId}/messages")]
        public async Task<IActionResult> GetMessages(int conversationId)
        {
            var messages = await _context.Messages
                .Where(m => m.ConversationId == conversationId)
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();

            return Ok(messages);
        }

        // ============================================
        // 3️⃣ Send message
        // ============================================
        [HttpPost("{conversationId}/send")]
        public async Task<IActionResult> SendMessage(int conversationId, [FromBody] SendMessageRequest request)
        {
            var message = new Message
            {
                ConversationId = conversationId,
                SenderId = request.SenderId,
                Content = request.Content,
                CreatedAt = DateTime.UtcNow
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            // update last_message_id
            var conversation = await _context.Conversations.FindAsync(conversationId);
            conversation.LastMessageId = message.MessageId;

            await _context.SaveChangesAsync();

            return Ok(message);
        }
    }

    // ================= DTOs =================

    public class PrivateConversationRequest
    {
        public int User1Id { get; set; }
        public int User2Id { get; set; }
    }

    public class SendMessageRequest
    {
        public int SenderId { get; set; }
        public string Content { get; set; }
    }
}