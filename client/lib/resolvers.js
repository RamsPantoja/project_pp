import dbConnect from './dbConnect';
import Users from '../models/Users';
import Courses from '../models/Courses';

export const resolvers = {
    Query: {
        getUsers: async (parent) => {
            await dbConnect();
            const users = await Users.find({});
            return users.filter((user) =>  user.isAdmin === false);

        },

        getCourses: async (parent) => {
            await dbConnect();
            const courses = await Courses.find((err, data) => {
                if(err) {
                    throw new Error(err)
                } else {
                    return data;
                }
            })

            return courses
        },
        
        getCourseById: async (parent, args) => {
            await dbConnect();
            const course = await Courses.findOne({_id: args.id}, (err, data) => {
                if(err) {
                    throw new Error(err);
                } else {
                    return data
                }
            });

            return course;
        }
    },
    Mutation: {
        createUser: async (parent, {input}) => {
            await dbConnect();
            
            const emailAlreadyExist = await Users.findOne({
                email: input.email
            });

            if (emailAlreadyExist) {
                throw new Error('El email ya existe!')
            }

            const newUser = await new Users({
                firstname: input.firstname,
                lastname: input.lastname,
                email: input.email,
                password: input.password,
                img: '',
                isAdmin: false,
            }).save();

            return `Gracias por registrarte ${input.firstname}, ya puedes iniciar sesion con tu nueva cuenta.`
        },
        
        addCourse: async (parent, {input}) => {
            await dbConnect();
            
            const newCourse = await new Courses({
                title: input.title,
                teacher: input.teacher,
                description: input.description,
                objectives: input.objectives,
                conceptList: input.conceptList,
                enrollmentLimit: input.enrollmentLimit,
                enrollmentUsers: [],
                price: input.price
            }).save();

            return 'Curso creado!';
        },

        insertUserInCourse: async (parent, {email, id}) => {
            await dbConnect();

            const user = await Users.findOne({email: email});

            if(!user) {
                throw new Error('User no found')
            }

            const course = await Courses.findOne({_id: id}, (err, data) => {
                try {
                    if (data) {
                        return data
                    }
                } catch (error) {
                    return error;
                }
            })

            course.enrollmentUsers.push(user);
            course.save();

            return 'Document updated'
        },

        deleteCourseByTitle: async (parent, {title}) => {
            await dbConnect();
            
            return new Promise((resolve, rejects) => {
                Courses.findOneAndRemove({title: title}, (error, doc) => {
                    if(error || !doc) {
                        rejects('No se puede eliminar ó no se encuentra el curso');
                    } else {
                        resolve('Se eliminó correctamente')
                    }
                });
            });
        },

        deleteUserInCourse: async (parent, {id, userEmail}) => {
            await dbConnect();

            return new Promise((resolve, rejects) => {
                Courses.findOneAndUpdate({_id: id}, {$pull: {enrollmentUsers: {email: userEmail}}}, (err, doc) => {
                    if(err) rejects(err)
                    else resolve('Usuario eliminadó')
                })
            })
        }
    }
}