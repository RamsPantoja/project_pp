import dbConnect from './dbConnect';
import Users from '../models/Users';
import Courses from '../models/Courses';

const paginateResults = ({
    after: cursor,
    limit,
    results,
    getCursor = () => null,
}) => {

    if(limit < 1) return [];

    if(!cursor) return results.slice(0, limit);

    const cursorIndex = results.findIndex(item => {
        let itemCursor = item.id ? item.id : getCursor(item);

        return itemCursor ? cursor === itemCursor : false;

    });


    return cursorIndex >= 0 
        ? cursorIndex === results.length -1
            ? []
            : results.slice(cursorIndex + 1, Math.min(results.length, cursorIndex + 1 + limit))
        : results.slice(0, limit)
}


export const resolvers = {
    Query: {
        getUsers: async (parent, {limit, after}) => {
            await dbConnect();
            const allUsers = await Users.find({isAdmin: false});
            allUsers.reverse();

            const users = paginateResults({
                after,
                limit: limit,
                results: allUsers
            })

            return users;
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
        },
        
        getUserByEmail: async (parent, {email}) => {
            await dbConnect();
            return new Promise((resolve, rejects) => {
                Users.findOne({email: email}, (err, user) => {
                    if(err || !user) rejects('No se encuentra el usuario');
                    else resolve(user)
                })
            })
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
        },

        deleteUserByEmail: async (parent, {userEmail}) => {
            await dbConnect();

            return new Promise((resolve, rejects) => {
                Users.findOneAndRemove({email: userEmail}, (error, user) => {
                    if(error || !user) rejects('No se cuentra el usuario');
                    else resolve('Se eliminó correctamente')
                })
            })

        }
    }
}