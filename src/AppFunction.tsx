import React, { FC, useEffect, useState } from 'react';
import { uuid } from 'uuidv4';
import peopleFromServer from './people.json';
import './App.scss';

type Maybe<T> = T | null;

interface User {
  name: string;
  sex: string;
  born: number;
  died: number;
  fatherName: Maybe<string>;
  motherName: Maybe<string>;
  slug: string;
}

export const AppFunction: FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isReverse, setIsReverse] = useState(false);
  const [sortBy, setSortBy] = useState<keyof User | null>(null);

  useEffect(() => {
    setTimeout(
      () => setUsers(peopleFromServer),
      500,
    );
  }, []);

  const changeSortHandler = (targetSortBy: keyof User) => {
    if (sortBy === targetSortBy) {
      // this.setState((prevState) => ({ isReverse: !prevState.isReverse }));
      setIsReverse((currentRev) => !currentRev);

      return;
    }

    // this.setState({ isReverse: false, sortBy: targetSortBy });
    setIsReverse(false);
    setSortBy(targetSortBy);
  };

  const filterUsers = (currentUser: User[]) => {
    return currentUser.filter(user => (
      user.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    ));
  };

  const sortUsers = (
    currentUser: User[],
  ): User[] => {
    const copy = [...currentUser];

    if (!sortBy) {
      return currentUser;
    }

    return copy.sort((a, b) => {
      const aEl = isReverse
        ? b[sortBy]
        : a[sortBy];
      const bEl = isReverse
        ? a[sortBy]
        : b[sortBy];

      if (typeof aEl === 'string' && typeof bEl === 'string') {
        return aEl.localeCompare(bEl);
      }

      if (typeof aEl === 'number' && typeof bEl === 'number') {
        return aEl - bEl;
      }

      return 0;
    });
  };

  const getSortIcon = (
    title: keyof User,
  ): string => {
    if (title !== sortBy) {
      return '↕';
    }

    return isReverse
      ? '🔼'
      : '️️️️🔽';
  };

  const headers: [keyof User] = Object.keys(users[0] || {}) as [keyof User];
  let preparedUsers = filterUsers(users);

  preparedUsers = sortUsers(preparedUsers);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Event listeners</h1>
      {!users.length && (<h2>Loading...</h2>)}

      <input
        type="search"
        placeholder="Search by name"
        onChange={(e) => (
          setSearchQuery(e.target.value)
        )}
        value={searchQuery}
      />

      <table>
        <thead>
          <tr>
            {headers.map((title) => (
              <th
                key={title}
                onClick={() => changeSortHandler(title)}
              >
                {`${title} ${getSortIcon(title)}`}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {preparedUsers.map((user) => {
            const values = Object.values(user);

            return (
              <tr key={user.slug}>
                {values.map((value) => (
                  <td key={uuid()}>{value}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
