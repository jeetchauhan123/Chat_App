# 📌 Chat Application

This document tracks the architectural progression and feature maturity of the Chat Application project.

---

# Phase 1 – UI Foundation & Page Structure

## Base Layout & Routing

- [x] Create main application layout structure
- [x] Configure routing between login and chat page
- [x] Implement protected route wrapper
- [x] Redirect unauthenticated users to login
- [x] Establish component folder structure

## Authentication UI

- [x] Create email input field
- [x] Create send otp button
- [x] Create otp input field
- [x] Create verify otp button
- [x] Implement basic form validation
- [x] Disable button when input empty
- [x] Show loading state during api call
- [x] Display error message for invalid otp

## Chat Page Layout

- [x] Create sidebar layout
- [x] Create chat window container
- [x] Create message list section
- [x] Create message input bar
- [x] Create send button
- [x] Implement conditional styling (sender/receiver)
- [x] Implement auto scroll to bottom

---

# Phase 2 – Database Design & Backend Setup

## User Entity

- [x] Create user model
- [x] Configure primary key (user_id)
- [x] Add email property
- [x] Add name property
- [x] Add status_message property
- [x] Add is_online property
- [x] Add last_seen property
- [x] Add created_at property
- [x] Configure unique email constraint
- [x] Configure nullable fields

## Conversation Entity

- [x] Create conversation model
- [x] Add conversation_id
- [x] Add participant references
- [x] Add last_message_id column
- [x] Configure navigation properties

## Message Entity

- [x] Create message model
- [x] Add message_id
- [x] Add sender_id
- [x] Add receiver_id
- [x] Add conversation_id
- [x] Add message_content
- [x] Add timestamp
- [x] Configure foreign key relationships

## Entity Framework Integration

- [x] Create application db context
- [x] Register db context
- [x] Configure sql connection string
- [x] Generate initial migration
- [x] Update database
- [x] Handle schema modifications
- [x] Debug migration errors

---

# Phase 3 – OTP Authentication System (Security Layer)

## OTP Generation

- [x] Implement otp generator method
- [x] Use random number generation logic
- [x] Store otp in memory dictionary
- [x] Map otp using email as key

## Send OTP Endpoint

- [x] Create send otp api endpoint
- [x] Validate email input
- [x] Check existing user
- [x] Create user if not exists
- [x] Persist user to database

## Verify OTP Endpoint

- [x] Create verify otp api endpoint
- [x] Compare stored otp with input
- [x] Remove otp after successful verification
- [x] Return error for mismatch
- [x] Handle invalid email case
- [x] Prevent null reference exceptions
- [ ] Implement otp expiration logic
- [ ] Add otp rate limiting

---

# Phase 4 – JWT Authentication & Authorization

## JWT Token Creation

- [x] Implement jwt creation method
- [x] Define symmetric security key
- [x] Add nameidentifier claim
- [x] Add email claim
- [x] Set expiration time
- [x] Generate signed token
- [x] Return token in response

## Authentication Middleware

- [x] Configure authentication services
- [x] Configure jwt bearer options
- [x] Define token validation parameters
- [x] Enable lifetime validation
- [x] Configure clock skew
- [x] Register authentication middleware
- [x] Register authorization middleware
- [x] Verify middleware order correctness

## Protected APIs

- [x] Apply authorize attribute
- [x] Extract user id from claims
- [x] Convert claim to integer
- [x] Validate unauthorized access behavior

---

# Phase 5 – Real-Time Communication (SignalR Layer)

## Hub Setup

- [x] Create chat hub class
- [x] Inherit from hub base class
- [x] Register signalr services
- [x] Map hub endpoint

## JWT + SignalR Integration

- [x] Configure jwt bearer events
- [x] Implement onMessageReceived event
- [x] Extract token from query string
- [x] Verify authenticated user inside hub
- [x] Implement custom IUserIdProvider
- [x] Register provider in dependency injection
- [x] Verify Clients.User mapping
- [x] Resolve negotiation issues
- [x] Debug 401 authentication errors

## Realtime Feature Enhancements

- [ ] Stop hub connection on logout
- [ ] Implement typing indicator
- [ ] Implement online/offline presence tracking
- [ ] Implement redis backplane for SignalR scaling

---

# Phase 6 – Messaging System Logic

## Send Message Flow

- [x] Create send message api endpoint
- [x] Validate message body
- [x] Create message entity
- [x] Persist message to database
- [x] Trigger real-time signalr push
- [x] Send message to receiver
- [x] Send confirmation to sender
- [x] Prevent duplicate message rendering

## Conversation Handling

- [x] Check existing conversation
- [x] Create conversation if not exists
- [x] Update last_message_id
- [x] Retrieve messages by conversation
- [x] Order messages by timestamp
- [ ] Add pagination for older messages
- [ ] Add infinite scroll

## Delivery Enhancements

- [ ] Implement message delivery status (sent/delivered/seen)

---

# Phase 7 – Frontend State Management

## Auth State

- [x] Create auth slice
- [x] Implement login reducer
- [x] Implement logout reducer
- [x] Store jwt token
- [x] Persist token in local storage
- [x] Rehydrate auth state on refresh
- [x] Implement logout cleanup logic

## Chat State

- [x] Create chat slice
- [x] Implement add message reducer
- [x] Implement set messages reducer
- [x] Append real-time messages to state
- [x] Prevent duplicate entries
- [x] Manage selected conversation state

---

# Phase 8 – UI Enhancements & User Controls

## Message Rendering

- [x] Render dynamic messages
- [x] Apply conditional styling
- [x] Implement date grouping logic
- [x] Render date separator
- [x] Auto scroll on new message

## User Controls

- [x] Add logout button
- [x] Hide/show sidebar toggle
- [x] Implement close chat button
- [ ] Personal data update section
- [ ] Update status message feature
- [ ] Profile editing modal

---

# Phase 9 – Production Hardening & Architecture Upgrade

## Architecture Improvements

- [ ] Add service layer abstraction
- [ ] Move business logic out of controllers
- [ ] Implement global exception middleware
- [ ] Implement standardized api response wrapper

## Security Improvements

- [x] Move jwt secret to appsettings.json
- [ ] Implement refresh token flow

## Infrastructure

- [ ] Add structured logging (Serilog)
- [x] Add docker support
- [x] Deploy to cloud (Frontend - Vercel / Backend - Render)



##BUGS - 
1. Loading screen when logs in auth -> chat page
2. Automatically generate chat in sidebar when new chat is created 
3. New message is displayed in current open chat weather it came from the same person or any other person
4. Personal chat and some other chat gets linked in display as they show same message no matter from where the message was sent
5. ✔ On enter page submit in auth 
6. ✔ border on button click to know button was clciked
7. ✔ disable button to prevent multiple api call
8. Chat input section in mobile view after selecting a file the input box gets out of the screen
9. ✔ Time in side bar and time of the actual message in chat is different (sidebar displays time of the very first message of chat)
10. Lagging site
11. ✔ Resolve Browser asking for other App and service permission
12. ✔ On enter click in auth otp section it directs to previous rather than submitting


##Improvements - 
1. ✔ Auth page responsiveness
2. Side Bar responsiveness
3. Chat panel responsiveness
4. Sending otp via mail
5. Highlight active chat
6. When a message new message comes highlight in sidebar
7. Weather the person is online or not
8. Typing
9. If the message is seen or not
10. How to handle Message coming from unknow from user
11. Profile page
12. Mute Chat
13. Delete Chat
14. Block Chat
15. Profile of Other Users
16. Encryption of chat message