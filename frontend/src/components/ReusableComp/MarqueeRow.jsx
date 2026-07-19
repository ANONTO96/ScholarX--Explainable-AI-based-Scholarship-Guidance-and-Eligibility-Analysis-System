const MarqueeRow = ({ items, reverse = false }) => (
  <div className="overflow-hidden">
    <div className={`marquee-content ${reverse ? "reverse" : ""}`}>
      {items.map((subject, index) => {
        const Icon = subject.icon;

        return (
          <div
            key={index}
            className="flex items-center gap-3 mx-3 px-5 py-3 rounded-xl border border-neutral-100 bg-neutral-100 whitespace-nowrap"
          >
            <Icon className="w-5 h-5 text-blue-400" />
            <span>{subject.name}</span>
          </div>
        );
      })}
    </div>
  </div>
);

export default MarqueeRow;