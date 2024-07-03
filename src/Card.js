import React from 'react';

const Card = ({ ticket }) => {
    return (
        <div className="card">
            <span>{ticket.id}</span>
            <h4>{ticket.title}</h4>
            <div className="card-footer">
                <span></span>
                <p>{ticket.tag}</p></div>
        </div>
    );
};

export default Card;
