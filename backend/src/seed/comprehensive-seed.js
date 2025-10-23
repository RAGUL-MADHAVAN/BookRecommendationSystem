import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Author from '../models/Author.js';
import Book from '../models/Book.js';
import User from '../models/User.js';

dotenv.config();

const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookrec';

const authors = [
  {
    name: 'J.K. Rowling',
    bio: 'British author, best known for the Harry Potter series. Her books have sold over 500 million copies worldwide.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
  },
  {
    name: 'George R.R. Martin',
    bio: 'American novelist and short story writer, screenwriter, and television producer. Best known for A Song of Ice and Fire fantasy series.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
  },
  {
    name: 'Stephen King',
    bio: 'American author of horror, supernatural fiction, suspense, crime, science-fiction, and fantasy novels. Often called the "King of Horror".',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
  },
  {
    name: 'J.R.R. Tolkien',
    bio: 'English writer and philologist, best known for The Hobbit and The Lord of the Rings trilogy. Father of modern fantasy literature.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
  },
  {
    name: 'Agatha Christie',
    bio: 'English writer known for her detective novels. The best-selling fiction writer of all time, with over 2 billion copies sold.',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
  },
  {
    name: 'Dan Brown',
    bio: 'American author best known for thriller novels, including The Da Vinci Code. His books combine art, history, and conspiracy theories.',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400'
  },
  {
    name: 'Suzanne Collins',
    bio: 'American television writer and author. Best known for The Hunger Games trilogy which has sold millions of copies worldwide.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'
  },
  {
    name: 'George Orwell',
    bio: 'English novelist, essayist, and critic. His work is characterized by lucid prose, social criticism, and opposition to totalitarianism.',
    avatarUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400'
  },
  {
    name: 'Jane Austen',
    bio: 'English novelist known for her six major novels which critique the British landed gentry at the end of the 18th century.',
    avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400'
  },
  {
    name: 'Isaac Asimov',
    bio: 'American writer and professor of biochemistry. Prolific author who wrote or edited more than 500 books in the science fiction genre.',
    avatarUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400'
  }
];

const booksData = [
  // Fantasy
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: 'J.K. Rowling',
    genre: 'Fantasy',
    description: 'Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry\'s eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts in with some astonishing news: Harry Potter is a wizard, and he has a place at Hogwarts School of Witchcraft and Wizardry.',
    rating: 4.8,
    coverUrl: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400',
    isTrending: true,
    reads: 15420
  },
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
    genre: 'Fantasy',
    description: 'The Dursleys were so mean and hideous that summer that all Harry Potter wanted was to get back to the Hogwarts School for Witchcraft and Wizardry. But just as he\'s packing his bags, Harry receives a warning from a strange, impish creature named Dobby who says that if Harry Potter returns to Hogwarts, disaster will strike.',
    rating: 4.7,
    coverUrl: 'https://images.unsplash.com/photo-1544716278-e513176f20b5?w=400',
    isTrending: true,
    reads: 12840
  },
  {
    title: 'A Game of Thrones',
    author: 'George R.R. Martin',
    genre: 'Fantasy',
    description: 'Long ago, in a time forgotten, a preternatural event threw the seasons out of balance. In a land where summers can last decades and winters a lifetime, trouble is brewing. The cold is returning, and in the frozen wastes to the north of Winterfell, sinister forces are massing beyond the kingdom\'s protective Wall.',
    rating: 4.6,
    coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
    isTrending: true,
    reads: 18900
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    description: 'In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort. Written for J.R.R. Tolkien\'s own children, The Hobbit met with instant critical acclaim when it was first published in 1937.',
    rating: 4.9,
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
    isTrending: false,
    reads: 22100
  },
  {
    title: 'The Fellowship of the Ring',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    description: 'One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkness bind them. In ancient times the Rings of Power were crafted by the Elven-smiths, and Sauron, the Dark Lord, forged the One Ring, filling it with his own power so that he could rule all others.',
    rating: 4.9,
    coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
    isTrending: false,
    reads: 19850
  },

  // Horror/Thriller
  {
    title: 'The Shining',
    author: 'Stephen King',
    genre: 'Horror',
    description: 'Jack Torrance\'s new job at the Overlook Hotel is the perfect chance for a fresh start. As the off-season caretaker at the atmospheric old hotel, he\'ll have plenty of time to spend reconnecting with his family and working on his writing. But as the harsh winter weather sets in, the idyllic location feels ever more remote... and more sinister.',
    rating: 4.5,
    coverUrl: 'https://images.unsplash.com/photo-1509266272358-7701da638078?w=400',
    isTrending: true,
    reads: 14200
  },
  {
    title: 'IT',
    author: 'Stephen King',
    genre: 'Horror',
    description: 'Welcome to Derry, Maine. It\'s a small city, a place as hauntingly familiar as your own hometown. Only in Derry the haunting is real. They were seven teenagers when they first stumbled upon the horror. Now they are grown-up men and women who have gone out into the big world to gain success and happiness. But the promise they made twenty-eight years ago calls them reunite in the same place where, as teenagers, they battled an evil creature that preyed on the city\'s children.',
    rating: 4.6,
    coverUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    isTrending: false,
    reads: 16700
  },

  // Mystery
  {
    title: 'Murder on the Orient Express',
    author: 'Agatha Christie',
    genre: 'Mystery',
    description: 'Just after midnight, the famous Orient Express is stopped in its tracks by a snowdrift. By morning, the millionaire Samuel Edward Ratchett lies dead in his compartment, stabbed a dozen times, his door locked from the inside. Without a shred of doubt, one of them is the murderer. Isolated by the storm, detective Hercule Poirot must find the killer among a dozen of the dead man\'s enemies, before the murderer decides to strike again.',
    rating: 4.7,
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    isTrending: false,
    reads: 13400
  },
  {
    title: 'And Then There Were None',
    author: 'Agatha Christie',
    genre: 'Mystery',
    description: 'Ten strangers are lured to an isolated island mansion off the Devon coast by a mysterious "U.N. Owen." At dinner a recorded message accuses each of them in turn of having a guilty secret, and by the end of the night one of the guests is dead. Stranded by a violent storm, and haunted by a nursery rhyme counting down one by one, they begin to die in a manner that eerily echoes the rhyme.',
    rating: 4.8,
    coverUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400',
    isTrending: true,
    reads: 15900
  },
  {
    title: 'The Da Vinci Code',
    author: 'Dan Brown',
    genre: 'Mystery',
    description: 'While in Paris, Harvard symbologist Robert Langdon is awakened by a phone call in the dead of the night. The elderly curator of the Louvre has been murdered inside the museum, his body covered in baffling symbols. As Langdon and gifted French cryptologist Sophie Neveu sort through the bizarre riddles, they are stunned to discover a trail of clues hidden in the works of Leonardo da Vinci.',
    rating: 4.3,
    coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400',
    isTrending: true,
    reads: 21000
  },

  // Dystopian/Young Adult
  {
    title: 'The Hunger Games',
    author: 'Suzanne Collins',
    genre: 'Dystopian',
    description: 'In the ruins of a place once known as North America lies the nation of Panem, a shining Capitol surrounded by twelve outlying districts. The Capitol is harsh and cruel and keeps the districts in line by forcing them all to send one boy and one girl between the ages of twelve and eighteen to participate in the annual Hunger Games, a fight to the death on live TV.',
    rating: 4.6,
    coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
    isTrending: true,
    reads: 28400
  },
  {
    title: 'Catching Fire',
    author: 'Suzanne Collins',
    genre: 'Dystopian',
    description: 'Against all odds, Katniss Everdeen has survived the Hunger Games twice. But now that she\'s made it out of the bloody arena alive, she\'s still not safe. The Capitol is angry. The Capitol wants revenge. Who do they think should pay for the unrest? Katniss. And what\'s worse, President Snow has made it clear that no one else is safe either.',
    rating: 4.7,
    coverUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400',
    isTrending: false,
    reads: 24200
  },
  {
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    description: 'Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real. Published in 1949, the book offers political satirist George Orwell\'s nightmarish vision of a totalitarian, bureaucratic world and one poor stiff\'s attempt to find individuality.',
    rating: 4.8,
    coverUrl: 'https://images.unsplash.com/photo-1495640452828-3df6795cf69b?w=400',
    isTrending: true,
    reads: 31200
  },

  // Classic/Romance
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    description: 'Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language. Jane Austen called this brilliant work "her own darling child" and its vivacious heroine, Elizabeth Bennet, "as delightful a creature as ever appeared in print."',
    rating: 4.7,
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    isTrending: false,
    reads: 18900
  },
  {
    title: 'Emma',
    author: 'Jane Austen',
    genre: 'Romance',
    description: 'Emma Woodhouse, handsome, clever, and rich, with a comfortable home and happy disposition, seemed to unite some of the best blessings of existence; and had lived nearly twenty-one years in the world with very little to distress or vex her. The real evils, indeed, of Emma\'s situation were the power of having rather too much her own way, and a disposition to think a little too well of herself.',
    rating: 4.5,
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    isTrending: false,
    reads: 14100
  },

  // Science Fiction
  {
    title: 'Foundation',
    author: 'Isaac Asimov',
    genre: 'Science Fiction',
    description: 'For twelve thousand years the Galactic Empire has ruled supreme. Now it is dying. But only Hari Seldon, creator of the revolutionary science of psychohistory, can see into the future—to a dark age of ignorance, barbarism, and warfare that will last thirty thousand years. To preserve knowledge and save humankind, Seldon gathers the best minds in the Empire and brings them to a bleak planet at the edge of the galaxy to serve as a beacon of hope for future generations.',
    rating: 4.6,
    coverUrl: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400',
    isTrending: false,
    reads: 12800
  },
  {
    title: 'I, Robot',
    author: 'Isaac Asimov',
    genre: 'Science Fiction',
    description: 'The three laws of Robotics: 1) A robot may not injure a human being or, through inaction, allow a human being to come to harm. 2) A robot must obey orders given to it by human beings except where such orders would conflict with the First Law. 3) A robot must protect its own existence as long as such protection does not conflict with the First or Second Law.',
    rating: 4.5,
    coverUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    isTrending: true,
    reads: 16200
  }
];

async function seed() {
  try {
    await mongoose.connect(DB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Author.deleteMany({});
    await Book.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create authors
    const authorDocs = [];
    for (const authorData of authors) {
      const author = await Author.create(authorData);
      authorDocs.push(author);
      console.log(`✍️  Created author: ${author.name}`);
    }

    // Create books
    for (const bookData of booksData) {
      const author = authorDocs.find(a => a.name === bookData.author);
      if (author) {
        await Book.create({
          ...bookData,
          author: author._id
        });
        console.log(`📚 Created book: ${bookData.title}`);
      }
    }

    // Create a test user
    const testUser = await User.findOne({ email: 'test@test.com' });
    if (!testUser) {
      await User.create({
        name: 'Test Reader',
        email: 'test@test.com',
        password: 'password123',
        role: 'user',
        rewards: {
          points: 160,
          level: 2,
          badges: []
        }
      });
      console.log('👤 Created test user (email: test@test.com, password: password123)');
    }

    console.log('\n✨ Seed complete! Your app now has amazing books!');
    console.log('📖 Total Authors:', authorDocs.length);
    console.log('📚 Total Books:', booksData.length);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
