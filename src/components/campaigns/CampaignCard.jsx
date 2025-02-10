import React from "react";
import { Link } from "react-router-dom";

const CampaignCard = ({ campaign }) => {
    return (
        <div className="campaign-card">
            <Link to={`/campaigns/${campaign.id}`}>
                {/* ... rest of the card content ... */}
            </Link>
        </div>
    );
};

export default CampaignCard;
