import bcrypt from 'bcryptjs';


const data = {
    users: [{
            name: 'Hamzat',
            email: 'admin@example.com',
            password: bcrypt.hashSync('1234', 8 /*the second parameter '8' is for salting while bcrypt is for hashing*/ ),
            isAdmin: true,
            isSeller: true,
            seller: {
                name: 'Puma',
                logo: '/images/logo1.png',
                description: 'best seller',
                rating: 4.5,
                numReviews: 120,
            }
        },
        {
            name: 'james',
            email: 'user@example.com',
            password: bcrypt.hashSync('1234', 8 /*the second parameter '8' is for salting while bcrypt is for hashing*/ ),
            isAdmin: false,
            isSeller: false
        },
    ],
    products: [{
            name: 'single back tat',
            category: 'angel',
            image: '/images/pr1.jpg',
            price: '0.01',
            brand: 'female',
            rating: 4.5,
            numReviews: '10',
            countInStock: '40',
            description: 'high quality',
        },
        {
            name: 'full tigh tat',
            category: 'animal',
            image: '/images/pr2.jpg',
            price: '121',
            brand: 'ant',
            rating: 4.0,
            countInStock: '0',
            numReviews: '11',
            description: 'high quality',
        },
        {
            name: 'full back tat',
            category: 'art',
            image: '/images/pr3.jpg',
            price: '122',
            brand: 'fiction',
            rating: 5,
            numReviews: '12',
            countInStock: '5',
            description: 'high quality',
        },
        {
            name: 'double back tat',
            category: 'angel',
            image: '/images/pr4.jpg',
            price: '124',
            brand: 'female',
            rating: 3.5,
            numReviews: '15',
            countInStock: '1',
            description: 'high quality',
        },
        {
            name: 'half tigh tat',
            category: 'flower',
            image: '/images/pr5.jpg',
            price: '129',
            brand: 'rose',
            rating: 3,
            numReviews: '20',
            countInStock: '2',
            description: 'high quality',
        },
        {
            name: 'leg tat',
            category: 'animal',
            image: '/images/pr6.jpg',
            price: '130',
            brand: 'wild',
            countInStock: '4',
            rating: 5,
            numReviews: '15',
            description: 'high quality',
        },

    ],
};
export default data;