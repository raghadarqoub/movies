import connectDB from './../db/connection.js';
import userRouter from './modules/user/user.router.js';
import adminRouter from './modules/admin/admin.router.js';
import moviesRouter from './modules/movies/movies.router.js';
import bookingRouter from './modules/booking/booking.router.js';
const initApp =(app , express) => {
    connectDB ();
    // app.use(cors());
    app.use(express.json());
    app.get('/', (req, res) => {
        return res.status(200).json({ message: "success" });
    })
    app.use('/user', userRouter);
    app.use('/admin', adminRouter);
    app.use('/movies', moviesRouter);
    app.use('/booking', bookingRouter);

    


    app.use('*', (req, res) => {
        return res.status(404).json({ message: "page not found" });
    })
}


export default initApp