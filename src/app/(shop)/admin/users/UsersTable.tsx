'use client';

import { IoCardOutline } from "react-icons/io5";
import Link from "next/link";
import type { User } from "@/interfaces";
import { changeUserRole } from "@/actions";

interface Props {
    users: User[];
}


export const UsersTable = ({ users }: Props) => {
    return (
        <section className="mb-10">
            <div className="overflow-x-auto">
                <table className="data-table">
                    <thead className="data-table__head">
                        <tr>
                            <th scope="col" className="data-table__th">
                                Email
                            </th>
                            <th scope="col" className="data-table__th">
                                Nombre completo
                            </th>
                            <th scope="col" className="data-table__th">
                                Rol
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr
                                key={user.id}
                                className="data-table__row"
                            >
                                <td className="data-table__cell data-table__cell--medium">
                                    {user.email}
                                </td>
                                <td className="data-table__cell">
                                    {user.name}
                                </td>
                                <td className="data-table__cell">
                                    <select
                                        value={user.role}
                                        onChange={e => changeUserRole(user.id, e.target.value)}
                                        className="address-form__input w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-primary-800 dark:border-primary-600 dark:text-secondary dark:focus:ring-accent"
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="User">User</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
