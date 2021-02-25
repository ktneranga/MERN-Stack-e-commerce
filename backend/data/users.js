//import bcrypt
import bcrypt from 'bcryptjs'

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true,
    },
    {
        name: 'Sapna Madurangi',
        email: 'sapna.madurangi@gmail.com',
        password: bcrypt.hashSync('123456', 10)
    },
    {
        name: 'Teran Neranga',
        email: 'teran.neranga@gmail.com.com',
        password: bcrypt.hashSync('123456', 10)
    }
];

export default users