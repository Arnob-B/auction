import { prisma } from "@/utils/db";
import { userList } from "@/utils/mockipl-users";
import bcrypt from "bcryptjs";

export const seedUsers = async () => {
	userList.map(async (user) => {
		const hashedPassword = await bcrypt.hash(user.password, 10);
		await prisma.user.create({
			data: {
				userId: user.userId,
				name: user.name,
				password: hashedPassword,
				role: "user",
			},
		});
	});
};
