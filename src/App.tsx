import React from 'react';
import './App.scss';
import { uuid } from 'uuidv4';
import peopleFromServer from './people.json';

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

interface State {
  users: User[];
  searchQuery: string;
  sortBy: keyof User | null;
  isReverse: boolean;
}

export class App extends React.Component<{}, State> {
  state: State = {
    users: [],
    searchQuery: '',
    sortBy: null,
    isReverse: false,
  };

  componentDidMount() {
    setTimeout(
      () => this.setState({ users: peopleFromServer }),
      500,
    );
  }

  getSortIcon(title: keyof User): string {
    const { sortBy, isReverse } = this.state;

    if (title !== sortBy) {
      return '↕';
    }

    return isReverse
      ? '🔼'
      : '️️️️🔽';
  }

  filterUsers(users: User[]): User[] {
    const { searchQuery } = this.state;

    return users.filter(user => (
      user.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    ));
  }

  sortUsers(users: User[]): User[] {
    const { sortBy, isReverse } = this.state;

    const copy = [...users];

    if (!sortBy) {
      return users;
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
  }

  changeSortHandler(targetSortBy: keyof User) {
    const { sortBy, isReverse } = this.state;

    if (sortBy === targetSortBy) {
      this.setState({ isReverse: !isReverse });

      return;
    }

    this.setState({ isReverse: false, sortBy: targetSortBy });
  }

  render() {
    const { users, searchQuery } = this.state;
    const headers: [keyof User] = Object.keys(users[0] || {}) as [keyof User];
    let preparedUsers = this.filterUsers(users);

    preparedUsers = this.sortUsers(preparedUsers);

    return (
      <div>
        <h1 style={{ textAlign: 'center' }}>Event listeners</h1>
        {!users.length && (<h2>Loading...</h2>)}

        <input
          type="search"
          placeholder="Search by name"
          onChange={(e) => (
            this.setState({ searchQuery: e.target.value })
          )}
          value={searchQuery}
        />

        <table>
          <thead>
            <tr>
              {headers.map((title) => (
                <th
                  key={title}
                  onClick={() => this.changeSortHandler(title)}
                >
                  {`${title} ${this.getSortIcon(title)}`}
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
  }
}
