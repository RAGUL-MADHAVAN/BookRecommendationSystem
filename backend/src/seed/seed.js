import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Author from '../models/Author.js';
import Book from '../models/Book.js';
import Quiz from '../models/Quiz.js';

dotenv.config();

const authorsData = [
  { name: 'Ava Hart', bio: 'Fantasy author', avatarUrl: '' },
  { name: 'Liam Ford', bio: 'Sci-Fi and space opera', avatarUrl: '' },
  { name: 'Nora Vale', bio: 'Mystery and thrillers', avatarUrl: '' },
  { name: 'Ethan Brooks', bio: 'Non-fiction tech', avatarUrl: '' },
  { name: 'Maya Chen', bio: 'Romance and drama', avatarUrl: '' },
];

const covers = {
  fantasy: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=800&auto=format',
  scifi: 'https://images.unsplash.com/photo-1447433819943-74a20887a81e?q=80&w=800&auto=format',
  mystery: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format',
  tech: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=800&auto=format',
  romance: 'https://images.unsplash.com/photo-1511407397940-d57f68e81203?q=80&w=800&auto=format',
};

const booksData = (authorIds) => [
  { title: 'Kingdom of Embers', author: authorIds[0], genre: 'Fantasy', description: 'Magic and destiny.', rating: 4.6, coverUrl: covers.fantasy, contentUrl: 'https://example.com/ember' },
  { title: 'Shadows of the Vale', author: authorIds[0], genre: 'Fantasy', description: 'Ancient prophecy.', rating: 4.2, coverUrl: covers.fantasy },
  { title: 'Starlight Armada', author: authorIds[1], genre: 'Sci-Fi', description: 'Fleet beyond Orion.', rating: 4.7, coverUrl: covers.scifi },
  { title: 'Echoes on Europa', author: authorIds[1], genre: 'Sci-Fi', description: 'Life under ice.', rating: 4.3, coverUrl: covers.scifi },
  { title: 'The Silent Witness', author: authorIds[2], genre: 'Mystery', description: 'A chilling whodunnit.', rating: 4.4, coverUrl: covers.mystery },
  { title: 'Midnight Cipher', author: authorIds[2], genre: 'Mystery', description: 'Codes and conspiracies.', rating: 4.1, coverUrl: covers.mystery },
  { title: 'Ship It Right', author: authorIds[3], genre: 'Non-Fiction', description: 'Practical devops.', rating: 4.5, coverUrl: covers.tech },
  { title: 'JavaScript Journeys', author: authorIds[3], genre: 'Non-Fiction', description: 'From basics to mastery.', rating: 4.0, coverUrl: covers.tech },
  { title: 'Hearts Aflame', author: authorIds[4], genre: 'Romance', description: 'Love and loss.', rating: 4.2, coverUrl: covers.romance },
  { title: 'Autumn Letters', author: authorIds[4], genre: 'Romance', description: 'Second chances.', rating: 4.1, coverUrl: covers.romance },
  { title: 'Neon Horizon', author: authorIds[1], genre: 'Sci-Fi', description: 'Cyberpunk odyssey.', rating: 4.3, coverUrl: covers.scifi },
  { title: 'Runes of Winter', author: authorIds[0], genre: 'Fantasy', description: 'Frozen realms.', rating: 4.0, coverUrl: covers.fantasy },
  { title: 'The Final Variable', author: authorIds[2], genre: 'Mystery', description: 'Deadly equation.', rating: 4.2, coverUrl: covers.mystery },
  { title: 'Cloud Craft', author: authorIds[3], genre: 'Non-Fiction', description: 'Cloud-native patterns.', rating: 4.1, coverUrl: covers.tech },
  { title: 'Winter Roses', author: authorIds[4], genre: 'Romance', description: 'Bloom in the snow.', rating: 4.0, coverUrl: covers.romance },
];

const run = async () => {
  await connectDB();
  console.log('Seeding database...');

  await Promise.all([
    User.deleteMany({}),
    Author.deleteMany({}),
    Book.deleteMany({}),
    Quiz.deleteMany({}),
  ]);

  // Admin user
  const admin = await User.create({ name: 'Admin', email: 'admin@example.com', password: 'admin123', role: 'admin' });
  console.log('Created admin:', admin.email);

  // Authors
  const createdAuthors = await Author.insertMany(authorsData);
  const authorIds = createdAuthors.map(a => a._id);

  // Books
  const createdBooks = await Book.insertMany(booksData(authorIds));
  console.log(`Created ${createdAuthors.length} authors and ${createdBooks.length} books.`);

  // Seed a sample quiz for the first book
  const firstBook = createdBooks[0];
  if (firstBook) {
    await Quiz.create({
      book: firstBook._id,
      questions: [
        { q: `Who is the author of "${firstBook.title}"?`, options: [createdAuthors[0].name, createdAuthors[1].name, createdAuthors[2].name, createdAuthors[3].name], answerIndex: 0, points: 10 },
        { q: 'What is the primary genre?', options: ['Sci-Fi','Fantasy','Mystery','Romance'], answerIndex: (firstBook.genre === 'Fantasy') ? 1 : 0, points: 10 }
      ]
    });
    console.log('Seeded a quiz for:', firstBook.title);
  }

  await mongoose.connection.close();
  console.log('Seed complete.');
};

run().catch(err => { console.error(err); process.exit(1); });
