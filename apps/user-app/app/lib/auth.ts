import { PrismaClient } from "@repo/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';

const db = new PrismaClient();

export const authOptions = {

    providers:[

        CredentialsProvider({

            name:'Credentials',
            credentials:{
                phone:{label:"Phone Number" , type: "text" , placeholder: "1231231231"},
                password:{label: "Password" , type: "password"}
            },

            async authorize(credentials) {
                if (!credentials) {
                    return null;
                }
                const { phone, password } = credentials as Record<"phone" | "password", string>;

                const existingUser = await db.user.findFirst({
                    where: {
                        number: phone,
                    },
                });

                if (existingUser) {
                    const passwordValidation = await bcrypt.compare(
                        password,
                        existingUser.password
                    );

                    if (passwordValidation) {
                        return {
                            id: existingUser.id.toString(),
                            name: existingUser.name,
                            email: existingUser.email,
                        };
                    }

                    return null;
                }

                try {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const user = await db.user.create({
                        data: {
                            number: phone,
                            password: hashedPassword,
                            email: `${phone}@example.com`,
                        },
                    });

                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.email,
                    };
                } catch (e) {
                    console.log(e);
                }

                return null;
            }
        })
    ],

    secret: process.env.JWT_SECRET || "secret",

    callbacks:{

        async session({ token , session}: { token: { sub?: string }; session: { user?: { id?: string } } }){

            if (!session.user) session.user = {};
            session.user.id = token.sub;

            return session
        }
    }
}