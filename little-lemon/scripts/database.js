import * as SQLite from 'expo-sqlite/legacy';

const db = SQLite.openDatabase('little_lemon.db');

export const createTable = () => {
    db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS menu (
        name TEXT PRIMARY KEY,
        description TEXT,
        price REAL,
        image TEXT,
        category TEXT
      );`
    );
  });
};

export const fetchMenuFromDB = (callback) => {
    db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM menu',
      [],
      (txObj, resultSet) => {
        callback(resultSet.rows._array);
      },
      (txObj, error) => {
        console.error('Failed to fetch menu from DB:', error);
      }
    );
  });
};

export const insertMenuItems = (menuItems) => {
    db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM menu' // Clear the table before inserting new data
    );
    menuItems.forEach(item => {
      tx.executeSql(
        'INSERT INTO menu (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)',
        [item.name, item.description, item.price, item.image, item.category]
      );
    });
  });
};

export const fetchMenuByCategories = (categories, callback) => {
  // If no categories are selected, return all menu items
  if (categories.length === 0) {
    fetchMenuFromDB(callback);
    console.log('No categories selected Menu Fetched');
    return;
  }
  const placeholders = categories.map(() => '?').join(', '); // Generate placeholders for the SQL query
  const query = `SELECT * FROM menu WHERE category IN (${placeholders})`;
  
  console.log('Executing Query:', query); // Debugging
  console.log('With Parameters:', placeholders); // Debugging
  console.log('With Parameters:', categories); // Debugging

  db.transaction(tx => {
    tx.executeSql(
      query,
      categories, 
      (txObj, resultSet) => { 
        callback(resultSet.rows._array); // Return the filtered menu items
      },
      (txObj, error) => {
        console.error('Failed to fetch menu by categories:', error);
      }
    );
  },
  error => {
    console.error('Transaction Error:', error);
  },
  () => {
    console.log('Transaction Success');
  }
  );
};

export const fetchMenuByName = (name, callback) => {
  // If no categories are selected, return all menu items
  if (name.length === 0) {
    fetchMenuFromDB(callback);
    console.log('No dish found with that name');
    return;
  }
  const query = `SELECT * FROM menu WHERE name LIKE ?`;
  let params = [`${name}%`];
  console.log('Executing Query:', query); // Debugging
  console.log('With Parameters:', name); // Debugging
  db.transaction(tx => {
    tx.executeSql(
      query,
      params, 
      (txObj, resultSet) => { 
        callback(resultSet.rows._array); // Return the filtered menu items
      },
      (txObj, error) => {
        console.error('Failed to fetch menu by name:', error);
      }
    );
  },
  error => {
    console.error('Transaction Error:', error);
  },
  () => {
    console.log('Transaction Success');
  }
  );
};