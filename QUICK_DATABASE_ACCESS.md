# 🚀 Quick Database Access - Cheat Sheet

## ⚡ Fastest Way: MongoDB Compass

### 1. Download (if not installed):
https://www.mongodb.com/try/download/compass

### 2. Connect:
- Open Compass
- Connection: `mongodb://localhost:27017`
- Click "Connect"

### 3. View Data:
- Click `bookrec` database
- Click any collection to view data

---

## 💻 Command Line Access

### Open MongoDB Shell:
```bash
mongosh
```

### Quick Commands:
```bash
# Switch to your database
use bookrec

# View all collections
show collections

# ====== USERS ======
# View all users with points
db.users.find({}, {name:1, email:1, "rewards.points":1, "rewards.level":1}).pretty()

# View specific user (test account)
db.users.findOne({email: "test@test.com"})

# Top 5 users by points
db.users.find().sort({"rewards.points": -1}).limit(5)

# ====== BOOKS ======
# View all books
db.books.find({}, {title:1, author:1, genre:1, rating:1}).pretty()

# Count books
db.books.countDocuments()

# Books by genre
db.books.find({genre: "Fantasy"})

# ====== AUTHORS ======
# View all authors
db.authors.find().pretty()

# ====== PROGRESS ======
# View all reading progress
db.progress.find().pretty()

# View completed books (100%)
db.progress.find({percentage: 100})

# View in-progress books (<100%)
db.progress.find({percentage: {$lt: 100}})

# ====== QUIZZES ======
# View all quizzes
db.quizzes.find().pretty()

# Count quizzes
db.quizzes.countDocuments()

# ====== REVIEWS ======
# View all reviews
db.reviews.find().pretty()
```

---

## 🎯 Demo Queries for Juries

### Show User Journey:
```bash
# 1. Find test user
db.users.findOne({email: "test@test.com"}, {
  name: 1,
  "rewards.points": 1,
  "rewards.level": 1,
  reading: 1,
  completed: 1
})

# 2. Find their progress
db.progress.find({user: ObjectId("USER_ID_HERE")})

# 3. Show leaderboard
db.users.find({}, {name: 1, "rewards.points": 1, "rewards.level": 1})
  .sort({"rewards.points": -1})
  .limit(10)
```

### Statistics to Impress:
```bash
# Total users
db.users.countDocuments()

# Total books
db.books.countDocuments()

# Total completed books (across all users)
db.progress.countDocuments({percentage: 100})

# Average book rating
db.books.aggregate([
  {$group: {_id: null, avgRating: {$avg: "$rating"}}}
])

# Most popular genre
db.books.aggregate([
  {$group: {_id: "$genre", count: {$sum: 1}}},
  {$sort: {count: -1}}
])

# User with most points
db.users.find().sort({"rewards.points": -1}).limit(1)

# Books completed this month (example)
db.progress.countDocuments({
  completedAt: {
    $gte: new Date("2025-10-01"),
    $lt: new Date("2025-11-01")
  }
})
```

---

## 🔍 What to Show Juries

### 1. Before Demo:
```bash
# Show user has 0 points
db.users.findOne({email: "demo@demo.com"}, {rewards: 1})
```

### 2. During Demo:
```bash
# Keep Compass open
# Refresh to show real-time updates
# Show progress changing
# Show points increasing
```

### 3. After Demo:
```bash
# Show final state
db.users.findOne({email: "demo@demo.com"}, {rewards: 1, completed: 1})

# Show they're on leaderboard
db.users.find().sort({"rewards.points": -1}).limit(10)
```

---

## 📊 Collections Overview

| Collection | What It Stores | Key Fields |
|------------|---------------|------------|
| **users** | User accounts | `email`, `rewards.points`, `rewards.level`, `reading[]`, `completed[]` |
| **books** | Book catalog | `title`, `author`, `genre`, `rating`, `coverUrl` |
| **authors** | Author info | `name`, `bio`, `avatarUrl` |
| **progress** | Reading progress | `user`, `book`, `percentage`, `completedAt` |
| **quizzes** | Quiz questions | `book`, `questions[]` with answers |
| **reviews** | User reviews | `user`, `book`, `rating`, `comment` |

---

## 🎬 Live Demo Flow

### Setup (Before Juries):
1. Open MongoDB Compass
2. Connect to `bookrec` database
3. Open `users` collection
4. Find your demo user
5. Keep it visible on second screen

### During Presentation:
1. **Show user**: 0 points initially
2. **Complete book in app**: Mark 100%
3. **Refresh Compass**: Show +20 points
4. **Take quiz in app**: Submit answers
5. **Refresh Compass**: Show +bonus points
6. **Open leaderboard**: Show new ranking
7. **Show progress collection**: Prove tracking

### Impact:
- Juries see real-time database updates
- Proves features actually work
- Shows technical implementation
- Demonstrates data persistence

---

## 💡 Pro Tips

### For Smooth Demo:
1. ✅ Test everything before presentation
2. ✅ Keep MongoDB Compass open
3. ✅ Have mongosh ready in terminal
4. ✅ Prepare a demo user account
5. ✅ Know exactly which collection to show when
6. ✅ Practice refreshing Compass quickly

### If Something Goes Wrong:
1. Check MongoDB is running: `mongosh` should connect
2. Check correct database: `show dbs` then `use bookrec`
3. Verify collections exist: `show collections`
4. Check app is connected to correct DB (check `.env`)

---

## 🚨 Emergency Commands

### If Data Gets Messed Up:
```bash
# Re-seed database (WARNING: Deletes all data!)
cd backend
npm run seed:pro
```

### Check Connection:
```bash
# Check if MongoDB is running
mongosh

# Check databases
show dbs

# Check your database
use bookrec
show collections
```

### Verify App Connection:
```bash
# In backend folder, check .env
cat .env

# Should have:
MONGODB_URI=mongodb://localhost:27017/bookrec
```

---

## ✅ Pre-Demo Checklist

- [ ] MongoDB running
- [ ] MongoDB Compass installed and connected
- [ ] Test user account created (test@test.com / password123)
- [ ] Some books have quizzes
- [ ] Backend server running (`npm run dev`)
- [ ] Frontend server running (`npm run dev`)
- [ ] Practiced complete user flow
- [ ] Know how to show database in Compass
- [ ] Know key mongosh commands
- [ ] Prepared demo script

---

**With these tools, you can confidently demonstrate your complete tracking and gamification system!** 🎯🚀
