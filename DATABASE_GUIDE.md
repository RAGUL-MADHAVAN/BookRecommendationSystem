# 📊 Database Viewing Guide

## 🎯 Your Database Structure

**Database Name**: `bookrec` (or check your `.env` MONGODB_URI)

### Collections (Tables):
1. **users** - All user accounts
2. **books** - All books in the system
3. **authors** - All authors
4. **progress** - User reading progress tracking
5. **quizzes** - Quiz questions for books
6. **reviews** - User book reviews

---

## Method 1: MongoDB Compass (Recommended - GUI) 🖥️

### Step 1: Download & Install
1. Go to: https://www.mongodb.com/try/download/compass
2. Download MongoDB Compass
3. Install it (free!)

### Step 2: Connect
1. Open MongoDB Compass
2. Connection String: `mongodb://localhost:27017`
3. Click "Connect"

### Step 3: View Your Data
1. Click on `bookrec` database (left sidebar)
2. Click on any collection:
   - **users** - See all users, their points, levels
   - **books** - See all 17 books from seed
   - **authors** - See all 10 authors
   - **progress** - See who's reading what, completion %
   - **quizzes** - See quiz questions
   - **reviews** - See user reviews

### Features in Compass:
- ✅ View all documents (rows)
- ✅ Search and filter
- ✅ Edit documents
- ✅ Delete documents
- ✅ Export data
- ✅ Beautiful UI!

---

## Method 2: MongoDB Shell (Command Line) 💻

### Step 1: Open Terminal
```bash
mongosh
```

### Step 2: Switch to Your Database
```bash
use bookrec
```

### Step 3: View Collections
```bash
# List all collections
show collections

# View all users
db.users.find().pretty()

# View all books
db.books.find().pretty()

# View all authors
db.authors.find().pretty()

# View user progress
db.progress.find().pretty()

# View quizzes
db.quizzes.find().pretty()

# View reviews
db.reviews.find().pretty()
```

### Useful Queries:

#### View Top 5 Users by Points
```bash
db.users.find({}, {name: 1, "rewards.points": 1, "rewards.level": 1}).sort({"rewards.points": -1}).limit(5)
```

#### View Completed Books for a User
```bash
db.users.findOne({email: "test@test.com"}, {completed: 1, reading: 1})
```

#### View Books by Genre
```bash
db.books.find({genre: "Fantasy"}, {title: 1, author: 1, rating: 1})
```

#### View User Progress
```bash
db.progress.find({}).populate("book").populate("user")
```

#### Count Documents
```bash
db.users.countDocuments()
db.books.countDocuments()
db.authors.countDocuments()
```

---

## Method 3: VS Code Extension 🔌

### Step 1: Install Extension
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search: "MongoDB for VS Code"
4. Install it

### Step 2: Connect
1. Click MongoDB icon in sidebar
2. Click "Add Connection"
3. Enter: `mongodb://localhost:27017`
4. Click "Connect"

### Step 3: Browse
1. Expand `bookrec` database
2. Right-click any collection
3. Click "View Documents"

---

## 🎯 What to Show Your Juries

### 1. User Tracking Features
**Show in `users` collection:**
```json
{
  "_id": "...",
  "name": "Test Reader",
  "email": "test@test.com",
  "rewards": {
    "points": 160,      // ← Points from completing books + quizzes
    "level": 2,         // ← Auto-calculated from points
    "badges": []
  },
  "reading": ["bookId1", "bookId2"],    // ← Currently reading
  "completed": ["bookId3", "bookId4"]   // ← Finished books
}
```

### 2. Progress Tracking
**Show in `progress` collection:**
```json
{
  "_id": "...",
  "user": "userId",
  "book": "bookId",
  "percentage": 75,           // ← 75% complete
  "completedAt": null,        // ← Will be set when 100%
  "createdAt": "2025-10-23",
  "updatedAt": "2025-10-23"
}
```

### 3. Quiz System
**Show in `quizzes` collection:**
```json
{
  "_id": "...",
  "book": "bookId",
  "questions": [
    {
      "q": "What is the main theme?",
      "options": ["Love", "War", "Adventure", "Mystery"],
      "answerIndex": 2,
      "points": 10
    }
  ]
}
```

### 4. Points System Explanation

**When user completes a book (100%):**
- ✅ Gets **20 points** automatically
- ✅ Book moved from `reading` to `completed` array
- ✅ Level updated (every 100 points = 1 level)

**When user completes quiz:**
- ✅ Gets **up to 30 bonus points** based on score
- ✅ Perfect score (100%) = 30 points
- ✅ 50% score = 15 points
- ✅ Points added to total
- ✅ Level auto-updates

**Example:**
- Complete Book: +20 points
- Perfect Quiz: +30 points
- **Total: 50 points per book!**

### 5. Leaderboard Logic
- Sorted by: Points → Level → Recent activity
- Top 10 users displayed
- Real-time updates when users complete books/quizzes

---

## 🧪 Quick Test Scenario for Juries

### Show This Flow:

1. **View Database Before:**
   - User has 0 points, Level 1
   - Book in `reading` array

2. **User Reads Book:**
   - Progress updates to 50%, 75%, 100%
   - Show in `progress` collection

3. **Book Completed:**
   - Check `users` collection
   - Points increased by 20
   - Book moved to `completed` array

4. **User Takes Quiz:**
   - Submit answers
   - Show score calculation

5. **After Quiz:**
   - Check `users` collection again
   - Bonus points added (up to 30)
   - Level updated if > 100 points
   - Leaderboard updated

6. **Final View:**
   - Leaderboard shows user's new rank
   - Profile shows points, level, completed books

---

## 📊 Database Statistics to Show

### Run these in MongoDB Shell:
```bash
# Total books
db.books.countDocuments()

# Total authors
db.authors.countDocuments()

# Total users
db.users.countDocuments()

# Books with quizzes
db.quizzes.countDocuments()

# Average book rating
db.books.aggregate([{$group: {_id: null, avgRating: {$avg: "$rating"}}}])

# Most popular genre
db.books.aggregate([{$group: {_id: "$genre", count: {$sum: 1}}}, {$sort: {count: -1}}])

# Top reader
db.users.find().sort({"rewards.points": -1}).limit(1)
```

---

## 🎊 Your Complete Feature Set

✅ **Book Tracking** - Users can add books to reading list  
✅ **Progress Tracking** - Percentage completion per book  
✅ **Auto Points Award** - 20 points when book 100% complete  
✅ **Quiz System** - Verify users actually read the book  
✅ **Quiz Points** - Up to 30 bonus points per quiz  
✅ **Level System** - Auto level-up every 100 points  
✅ **Leaderboard** - Competitive ranking by points  
✅ **Real-time Updates** - Database reflects all changes  

**Total Possible: 50 points per book (20 + 30)** 🎯

---

## 💡 Pro Tips for Presentation

1. **Open MongoDB Compass before demo**
2. **Show empty user first** (0 points)
3. **Complete a book live** (show +20 points)
4. **Take quiz live** (show +bonus points)
5. **Refresh leaderboard** (show new rank)
6. **Show database** (prove it's real-time!)

This proves your gamification and tracking features work! 🚀
