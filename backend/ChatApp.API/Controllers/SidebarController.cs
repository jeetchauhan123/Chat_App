using ChatApp.API.Data;
using ChatApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SidebarController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SidebarController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("start-conversation")]
        public async Task<IActionResult> StartConversation(int user1Id, int user2Id)
        {
            // 1️⃣ Check if private conversation already exists
            var existingConversation = await (
                from c in _context.Conversations
                join cm1 in _context.ConversationMembers
                    on c.ConversationId equals cm1.ConversationId
                join cm2 in _context.ConversationMembers
                    on c.ConversationId equals cm2.ConversationId
                where c.ConversationType == "private"
                      && cm1.UserId == user1Id
                      && cm2.UserId == user2Id
                select c
            ).FirstOrDefaultAsync();

            if (existingConversation != null)
                return Ok(existingConversation);

            // 2️⃣ Create new conversation
            var conversation = new Conversation
            {
                ConversationType = "private",
                CreatedAt = DateTime.UtcNow
            };

            _context.Conversations.Add(conversation);
            await _context.SaveChangesAsync();

            // 3️⃣ Add both users to conversation_members
            var members = new List<ConversationMember>
            {
                new ConversationMember
                {
                    ConversationId = conversation.ConversationId,
                    UserId = user1Id,
                    JoinedAt = DateTime.UtcNow
                },
                new ConversationMember
                {
                    ConversationId = conversation.ConversationId,
                    UserId = user2Id,
                    JoinedAt = DateTime.UtcNow
                }
            };

            _context.ConversationMembers.AddRange(members);
            await _context.SaveChangesAsync();

            return Ok(conversation);
        }

        [HttpGet("conversations/{userId}")]
        public async Task<IActionResult> GetUserConversations(int userId)
        {
            var conversations = await _context.Conversations
                .Where(c => c.ConversationMembers.Any(m => m.UserId == userId))
                .Include(c => c.ConversationMembers)
                    .ThenInclude(cm => cm.User)
                .Include(c => c.LastMessage)
                .OrderByDescending(c => c.LastMessage != null ? c.LastMessage.CreatedAt : c.CreatedAt)
                .Select(c => new
                {
                    c.ConversationId,
                    c.ConversationType,
                    c.CreatedAt,
                    LastMessage = c.LastMessage != null ? c.LastMessage.Content : null,
                    LastMessageTime = c.LastMessage != null
                        ? c.LastMessage.CreatedAt
                        : (DateTime?)null,   // 👈 IMPORTANT (nullable)

                    OtherUser = c.ConversationMembers
                        .Where(m => m.UserId != userId)
                        .Select(m => new
                        {
                            m.User.UserId,
                            m.User.Name
                        })
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(conversations);
        }
    }
}