# 📌 Chat Application – Development Roadmap

This document tracks the architectural progression, feature implementation, and planned improvements of the Chat Application project.

---

# Phase 1 – UI Foundation & Page Structure

## Functionality – Base Layout & Routing ✅ DONE

- create main application layout structure DONE
- configure routing between login and chat page DONE
- implement protected route wrapper DONE
- redirect unauthenticated users to login DONE
- establish component folder structure DONE

## Functionality – Authentication UI ✅ DONE

- create email input field DONE
- create send otp button DONE
- create otp input field DONE
- create verify otp button DONE
- implement basic form validation DONE
- disable button when input empty DONE
- show loading state during api call DONE
- display error message for invalid otp DONE

## Functionality – Chat Page Layout ✅ DONE

- create sidebar layout DONE
- create chat window container DONE
- create message list section DONE
- create message input bar DONE
- create send button DONE
- implement conditional styling for sender and receiver DONE
- implement auto scroll to bottom on new message DONE

---

# Phase 2 – Database Design & Backend Setup

## Functionality – User Entity ✅ DONE

- create user model DONE
- configure primary key (user_id) DONE
- add email property DONE
- add name property DONE
- add status_message property DONE
- add is_online property DONE
- add last_seen property DONE
- add created_at property DONE
- configure unique email constraint DONE
- configure nullable fields DONE

## Functionality – Conversation Entity ✅ DONE

- create conversation model DONE
- add conversation_id DONE
- add participant references DONE
- add last_message_id column DONE
- configure navigation properties DONE

## Functionality – Message Entity ✅ DONE

- create message model DONE
- add message_id DONE
- add sender_id DONE
- add receiver_id DONE
- add conversation_id DONE
- add message_content DONE
- add timestamp DONE
- configure foreign key relationships DONE

## Functionality – Entity Framework Integration ✅ DONE

- create application db context DONE
- register db context in program configuration DONE
- configure sql connection string DONE
- generate initial migration DONE
- update database DONE
- handle schema modifications during development DONE
- debug migration errors DONE

---

# Phase 3 – OTP Authentication System

## Functionality – OTP Generation ✅ DONE

- implement otp generator method DONE
- use random number generation logic DONE
- store otp in memory dictionary DONE
- map otp using email as key DONE

## Functionality – Send OTP Endpoint ✅ DONE

- create send otp api endpoint DONE
- validate email input DONE
- check existing user DONE
- create user if not exists DONE
- persist user to database DONE

## Functionality – Verify OTP Endpoint ⚠️ PARTIALLY COMPLETE

- create verify otp api endpoint DONE
- compare stored otp with input DONE
- remove otp after successful verification DONE
- return error for mismatch DONE
- handle invalid email case DONE
- prevent null reference exceptions DONE
- implement otp expiration logic (pending improvement)

---

# Phase 4 – JWT Authentication & Authorization

## Functionality – JWT Token Creation ✅ DONE

- implement jwt creation method DONE
- define symmetric security key DONE
- add nameidentifier claim DONE
- add email claim DONE
- set expiration time DONE
- generate signed token DONE
- return token in response DONE

## Functionality – Authentication Middleware ✅ DONE

- configure authentication services DONE
- configure jwt bearer options DONE
- define token validation parameters DONE
- enable lifetime validation DONE
- configure clock skew DONE
- register authentication middleware DONE
- register authorization middleware DONE
- verify middleware order correctness DONE

## Functionality – Protected APIs ✅ DONE

- apply authorize attribute DONE
- extract user id from claims DONE
- convert claim to integer DONE
- validate unauthorized access behavior DONE

---

# Phase 5 – Real-Time Communication (SignalR)

## Functionality – Hub Setup ✅ DONE

- create chat hub class DONE
- inherit from hub base class DONE
- register signalr services DONE
- map hub endpoint DONE

## Functionality – Frontend Hub Connection ⚠️ IMPROVEMENT PENDING

- configure hub connection url DONE
- pass access token using accessTokenFactory DONE
- start hub connection DONE
- handle connection start errors DONE
- stop hub connection on logout (pending logout implementation)

## Functionality – JWT + SignalR Integration ✅ DONE

- configure jwt bearer events DONE
- implement onMessageReceived event DONE
- extract token from query string DONE
- debug 401 authentication errors DONE
- resolve negotiation issues DONE
- verify authenticated user inside hub DONE

## Functionality – User Mapping ✅ DONE

- implement custom IUserIdProvider DONE
- extract NameIdentifier claim DONE
- register provider in dependency injection DONE
- verify Clients.User mapping DONE
- resolve incorrect user mapping bug DONE

---

# Phase 6 – Messaging System Logic

## Functionality – Send Message Flow ✅ DONE

- create send message api endpoint DONE
- validate message body DONE
- create message entity DONE
- persist message to database DONE
- trigger real-time signalr push DONE
- send message to receiver DONE
- send confirmation to sender DONE
- prevent duplicate message rendering DONE

## Functionality – Conversation Handling ✅ DONE

- check existing conversation DONE
- create conversation if not exists DONE
- update last_message_id DONE
- retrieve messages by conversation DONE
- order messages by timestamp DONE

---

# Phase 7 – Redux State Management

## Functionality – Auth State ✅ DONE

- create auth slice DONE
- implement login reducer DONE
- implement logout reducer DONE
- store jwt token DONE
- persist token in local storage DONE
- rehydrate auth state on refresh DONE

## Functionality – Chat State ✅ DONE

- create chat slice DONE
- implement add message reducer DONE
- implement set messages reducer DONE
- append real-time messages to state DONE
- prevent duplicate entries DONE
- manage selected conversation state DONE

---

# Phase 8 – UI Enhancements & Stability

## Functionality – Message Rendering ✅ DONE

- render dynamic messages DONE
- apply conditional styling DONE
- implement date grouping logic DONE
- render date separator DONE
- auto scroll on new message DONE

## Functionality – UX Improvements ✅ DONE

- clear input after send DONE
- prevent empty message sending DONE
- display loading states DONE
- display error messages DONE

## Functionality – Debugging & Stability Improvements ✅ DONE

- resolve cors preflight issues DONE
- fix credential mismatch issue DONE
- resolve signalr negotiation 404 DONE
- resolve jwt validation failures DONE
- correct middleware order issue DONE
- fix null reference exceptions DONE
- fix message duplication bug DONE
- fix ui re-rendering issue DONE

---

# Phase 9 – Feature Enhancements (Planned)

## Functionality – User Controls

- add logout button
- implement logout cleanup logic
- hide/show sidebar toggle
- implement close chat button
- personal data update section
- update status message feature
- profile editing modal

## Functionality – Chat Enhancements

- typing indicator via signalr
- online/offline presence tracking
- pagination for older messages
- infinite scroll
- message delivery status (sent/delivered/seen)

---

# Phase 10 – Production Hardening & Architecture Upgrade

## Functionality – Architecture Improvements

- add service layer abstraction
- move business logic out of controllers
- implement global exception middleware
- implement standardized api response wrapper

## Functionality – Security Improvements

- move jwt secret to appsettings.json
- implement refresh token flow
- enforce otp expiration
- add otp rate limiting

## Functionality – Infrastructure

- add structured logging (serilog)
- add docker support
- deploy to cloud (azure / railway / render)
- implement redis backplane for signalr scaling