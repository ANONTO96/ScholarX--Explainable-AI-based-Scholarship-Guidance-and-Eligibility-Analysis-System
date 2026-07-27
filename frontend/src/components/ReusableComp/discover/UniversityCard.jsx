

const UniversityCard = ({university}) => {
    return (
        <div className="rounded-3xl bg-white p-5 border border-gray-200 hover:border-sky-200 hover:shadow-xl hover:scale-101 transition-all">

                <img
                  src={university.image}
                  className="w-full h-42 rounded-xl object-cover"
                />

                <h2 className="text-2xl font-semibold mt-5">
                  {university.name}
                </h2>

                <p className="text-gray-500">
                  {university.city}, {university.country}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">

                  {university.popularPrograms.map(program => (
                    <span
                      key={program}
                      className="bg-blue-100 rounded-full px-3 py-1"
                    >
                      {program}
                    </span>
                  ))}

                </div>

                <div className="mt-5 flex justify-between space-y-2">

                  <div>
                    <p>🏆 QS Ranking #{university.qsRanking}</p>

                  <p>💰 Tuition Fee: {university.tuition}</p>
                  </div>
                  <div>
                    <p>🎓 {university.programsCount} Programs</p>

                  <p>🎁 {university.scholarshipsCount} Scholarships</p>
                  </div>

                </div>

              </div>
    );
};

export default UniversityCard;