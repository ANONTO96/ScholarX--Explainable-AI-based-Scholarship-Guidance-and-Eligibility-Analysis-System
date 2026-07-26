

const OpportunityCard = ({opportunity}) => {
    return (
        <div className="rounded-3xl bg-white p-5 border border-gray-200 hover:border-sky-200 hover:shadow-xl hover:scale-101 transition-all">

                <img alt=""
                  src={opportunity.image}
                  className="w-full h-42 rounded-xl object-cover"
                />

                <div className="flex justify-between mt-4">

                  <h2 className="text-xl font-semibold">

                    {opportunity.title}

                  </h2>

                  <span className="text-sky-600">

                    {opportunity.category}

                  </span>

                </div>

                <p className="text-gray-500 mt-2">

                  {opportunity.provider}

                </p>

                <div className="mt-5">

                  <p>📍 {opportunity.country}</p>

                  <p>💰 {opportunity.funding}</p>

                  <p>📅 {opportunity.deadline}</p>

                </div>

              </div>
    );
};

export default OpportunityCard;