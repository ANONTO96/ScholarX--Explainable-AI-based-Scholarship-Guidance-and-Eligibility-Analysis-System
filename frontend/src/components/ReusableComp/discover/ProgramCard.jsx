import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router";


const ProgramCard = ({ program }) => {
    return (
        <div
                key={program.id}
                className="rounded-3xl bg-white p-5 border border-gray-200 hover:border-sky-200 hover:shadow-xl hover:scale-101 transition-all"
            >
                <div className="flex gap-4">

                    <img alt=""
                        src={program.image}
                        className="w-28 h-28 rounded-xl object-cover"
                    />

                    <div className="flex-1">

                        <div className="flex justify-between">

                            <div>

                                <h2 className="text-2xl font-semibold">
                                    {program.name}
                                </h2>

                                <p className="text-gray-500 mt-1">
                                    {program.topCountries.slice(0, 3).join(" • ")}

                                    {program.topCountries.length > 3 && (
                                        <span className="text-sky-600">
                                            {" "}+{program.topCountries.length - 3} more
                                        </span>
                                    )}
                                </p>

                            </div>

                        </div>

                        <div className="flex flex-wrap gap-2 mt-5">

                            {program.degrees?.map((degree) => (
                                <span
                                    key={degree}
                                    className="rounded-full bg-blue-100 px-3 py-1 text-sm"
                                >
                                    {degree}
                                </span>
                            ))}

                        </div>

                        <div className="flex gap-6 mt-5 text-sm text-gray-600">

                            <span>
                                🎓 {program.universitiesCount} Universities
                            </span>

                            <span>
                                💰 {program.scholarshipsCount} Scholarships
                            </span>

                        </div>

                        <NavLink
                            to={`/programDetails/${program.slug}`}
                            className="group flex items-center gap-2 mt-2 font-semibold text-gray-900 hover:text-blue-500 transition"
                        >
                            Learn More
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </NavLink>

                    </div>

                </div>

            </div>
    );
};

export default ProgramCard;