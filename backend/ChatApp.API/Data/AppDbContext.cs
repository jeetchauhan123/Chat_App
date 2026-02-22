using Microsoft.EntityFrameworkCore;
using ChatApp.API.Models;

namespace ChatApp.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<ConversationMember> ConversationMembers { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // ================= USERS =================
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");

                entity.HasKey(e => e.UserId);

                entity.Property(e => e.UserId)
                      .HasColumnName("user_id");

                entity.Property(e => e.Email)
                      .HasColumnName("email")
                      .IsRequired();

                entity.Property(e => e.Name)
                      .HasColumnName("name");

                entity.Property(e => e.StatusMessage)
                      .HasColumnName("status_message");

                entity.Property(e => e.IsOnline)
                      .HasColumnName("is_online");

                entity.Property(e => e.LastSeen)
                      .HasColumnName("last_seen");

                entity.Property(e => e.CreatedAt)
                      .HasColumnName("created_at");
            });

            // ================= CONVERSATIONS =================
            modelBuilder.Entity<Conversation>(entity =>
            {
                entity.ToTable("conversations");

                entity.HasKey(c => c.ConversationId);

                entity.Property(c => c.ConversationId)
                      .HasColumnName("conversation_id");

                entity.Property(c => c.ConversationType)
                      .HasColumnName("conversation_type");

                entity.Property(c => c.LastMessageId)
                      .HasColumnName("last_message_id");

                entity.Property(c => c.CreatedAt)
                      .HasColumnName("created_at");
            });

            // ================= CONVERSATION MEMBERS =================
            modelBuilder.Entity<ConversationMember>(entity =>
            {
                entity.ToTable("conversation_members");

                entity.HasKey(cm => new { cm.ConversationId, cm.UserId });

                entity.Property(cm => cm.ConversationId)
                      .HasColumnName("conversation_id");

                entity.Property(cm => cm.UserId)
                      .HasColumnName("user_id");

                entity.Property(cm => cm.JoinedAt)
                      .HasColumnName("joined_at");
            });

            // ================= MESSAGES =================
            modelBuilder.Entity<Message>(entity =>
            {
                entity.ToTable("messages");

                entity.HasKey(m => m.MessageId);

                entity.Property(m => m.MessageId)
                      .HasColumnName("message_id");

                entity.Property(m => m.ConversationId)
                      .HasColumnName("conversation_id");

                entity.Property(m => m.SenderId)
                      .HasColumnName("sender_id");

                entity.Property(m => m.Content)
                      .HasColumnName("content");

                entity.Property(m => m.CreatedAt)
                      .HasColumnName("created_at");
            });

            // ================= RELATIONSHIPS =================

            // ConversationMembers → Users
            modelBuilder.Entity<ConversationMember>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(cm => cm.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // ConversationMembers → Conversations
            modelBuilder.Entity<ConversationMember>()
                .HasOne<Conversation>()
                .WithMany()
                .HasForeignKey(cm => cm.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);

            // Messages → Conversations
            modelBuilder.Entity<Message>()
                .HasOne<Conversation>()
                .WithMany()
                .HasForeignKey(m => m.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);

            // Messages → Users
            modelBuilder.Entity<Message>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Conversations → LastMessage (SET NULL)
            modelBuilder.Entity<Conversation>()
                .HasOne<Message>()
                .WithMany()
                .HasForeignKey(c => c.LastMessageId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}