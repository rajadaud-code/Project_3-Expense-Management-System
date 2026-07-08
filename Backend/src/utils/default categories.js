// Define a set of default categories for income and expenses
export const defaultCategories = [
  // Income categories
  { name: 'Salary', type: 'income', icon: 'briefcase', color: '#1089B1' }, 

  { name: 'Freelance', type: 'income', icon: 'laptop', color: '#22C55E' }, 

  { name: 'Investments', type: 'income', icon: 'trending-up', color: '#1488A6' }, 

  { name: 'Gifts', type: 'income', icon: 'gift', color: '#6967B6' }, 

  { name: 'Other Income', type: 'income', icon: 'plus-circle', color: '#0DAE59' }, 

  // Expense categories
  { name: 'Food & Dining', type: 'expense', icon: 'utensils', color: '#F59E0B' }, 

  { name: 'Groceries', type: 'expense', icon: 'shopping-cart', color: '#E4A380' }, 

  { name: 'Transportation', type: 'expense', icon: 'car', color: '#E44444' },

  { name: 'Rent', type: 'expense', icon: 'home', color: '#F43F5E' }, 

  { name: 'Utilities', type: 'expense', icon: 'zap', color: '#E48989' }, 

  { name: 'Entertainment', type: 'expense', icon: 'film', color: '#A855F7' }, 

  { name: 'Shopping', type: 'expense', icon: 'shopping-bag', color: '#B85CF6' }, 

  { name: 'Healthcare', type: 'expense', icon: 'heart', color: '#38BDF8' }, 

  { name: 'Education', type: 'expense', icon: 'book-open', color: '#6366F1' }, 

  { name: 'Travel', type: 'expense', icon: 'plane', color: '#F97316' }, 

  { name: 'Personal Care', type: 'expense', icon: 'sparkles', color: '#D946EF' }, 

  { name: 'Other Expense', type: 'expense', icon: 'more-horizontal', color: '#64748B' }, 
];

// Export the array so it can be imported and used in other files
export default defaultCategories;
