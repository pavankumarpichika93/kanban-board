import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Column from './Column';
import './styles.css';

const KanbanBoard = () => {
    const [tickets, setTickets] = useState([]);
    const [controls, setControls] = useState(false);
    const [grouping, setGrouping] = useState('status');
    const [ordering, setOrdering] = useState('priority');

    useEffect(() => {

        const fetchData = async () => {
            const response = await axios.get("https://api.quicksell.co/v1/internal/frontend-assignment");
            updateTicketArray(response.data.tickets, response.data.users)
        }
        fetchData();

        const savedGrouping = localStorage.getItem('grouping');
        const savedOrdering = localStorage.getItem('ordering');
        if (savedGrouping) setGrouping(savedGrouping);
        if (savedOrdering) setOrdering(savedOrdering);
    }, []);

    useEffect(() => {
        localStorage.setItem('grouping', grouping);
        localStorage.setItem('ordering', ordering);
    }, [grouping, ordering]);

    const updateTicketArray = (tickets, users) => {
        const userMap = users.reduce((acc, user) => {
            acc[user.id] = user.name;
            return acc;
        }, {});

        const updatedArray = tickets.map(ticket => ({
            ...ticket,
            username: userMap[ticket.userId] || 'Unknown User',
        }));
        console.log("updatedArray", updatedArray)
        setTickets(updatedArray);
    };

    const handleGroupByStatus = (tickets) => {
        const groups = tickets.reduce((acc, ticket) => {
            if (!acc[ticket.status]) acc[ticket.status] = [];
            acc[ticket.status].push(ticket);
            return acc;
        }, {});
        return groups;
    };

    const handleGroupByUser = (tickets) => {
        const groups = tickets.reduce((acc, ticket) => {
            if (!acc[ticket.username]) acc[ticket.username] = [];
            acc[ticket.username].push(ticket);
            return acc;
        }, {});
        return groups;
    };

    const handleGroupByPriority = (tickets) => {
        const groups = tickets.reduce((acc, ticket) => {
            if (!acc[ticket.priority]) acc[ticket.priority] = [];
            acc[ticket.priority].push(ticket);
            return acc;
        }, {});
        return groups;
    };

    const sortByPriority = (tickets) => {
        return tickets.sort((a, b) => b.priority - a.priority);
    };

    const sortByTitle = (tickets) => {
        return tickets.sort((a, b) => a.title.localeCompare(b.title));
    };

    const groupedTickets = grouping === 'status' ? handleGroupByStatus(tickets) :
        grouping === 'user' ? handleGroupByUser(tickets) :
            handleGroupByPriority(tickets);

    Object.keys(groupedTickets).forEach(group => {
        groupedTickets[group] = ordering === 'priority' ? sortByPriority(groupedTickets[group]) : sortByTitle(groupedTickets[group]);
    });

    const handleGroupingChange = (event) => {
        setGrouping(event.target.value);
    };
    const showControls = () => {
        setControls(!controls);
    }

    return (
        <>
            <div className="kanban-header" onClick={showControls}>Display</div>
            {controls && <div className="controls">
                <label htmlFor="grouping">Group By: </label>
                <select id="grouping" value={grouping} onChange={handleGroupingChange}>
                    <option value="status">Status</option>
                    <option value="user">User</option>
                    <option value="priority">Priority</option>
                </select>
            </div>}
            <div className="board">

                {Object.keys(groupedTickets).map(group => (
                    <Column key={group} title={group} tickets={groupedTickets[group]} />
                ))}
            </div>
        </>
    );
};

export default KanbanBoard;
