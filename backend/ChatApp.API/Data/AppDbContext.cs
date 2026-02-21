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
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Conversation>().ToTable("conversations");
            modelBuilder.Entity<Message>().ToTable("messages");

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");

                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.StatusMessage).HasColumnName("status_message");
                entity.Property(e => e.IsOnline).HasColumnName("is_online");
                entity.Property(e => e.LastSeen).HasColumnName("last_seen");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            });
        }


    }
}