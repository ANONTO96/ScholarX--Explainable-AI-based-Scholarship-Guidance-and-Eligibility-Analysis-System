import { CheckCircle2, CircleX, FileText } from "lucide-react";

export default function DocumentMatchingLevel({ initialResult = null }) {
  const result = initialResult;
  const documents = result?.results || [];

  const totalPercentage = Number(
    result?.percentage ??
      (result?.maximum_score ? (result.score / result.maximum_score) * 100 : 0),
  );

  // Document Name and Condition Helpers

  const getDocumentTitle = (document) => {
    const name = document.document_name || document.name || "required-document";

    const formattedName =
      name.charAt(0).toUpperCase() +
      name.slice(1).replace(/-doc$/, "").replace(/-/g, " ");

    if (["Moi", "Pcc"].includes(formattedName)) {
      return formattedName.toUpperCase();
    }

    return formattedName;
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-sky-600">
          Level 1
        </p>
        <h3 className="mt-1 flex items-center gap-2 text-lg font-black text-slate-900">
          <FileText size={19} /> Document matching
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Each available required document earns 3 points.
        </p>
      </div>

      {!result ? (
        <p className="p-5 text-sm text-slate-500">
          Document matching results will appear after the eligibility analysis.
        </p>
      ) : (
        <div className="p-5">
          <div className="p-3 mb-4 space-y-3 grid grid-cols-3 gap-3 self-center items-center sm:grid-cols-2">
            <div className="bg-green-50 p-4">
   
                <p className="text-xs font-semibold text-green-900 rounded">
                  Document Matching Percentage
                </p>
                <p className="mt-1 text-3xl font-black tabular-nums text-green-900">
                  {totalPercentage !== null
                    ? `${Number(totalPercentage).toFixed(2)}%`
                    : "—"}
                </p>
            
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
              <div>
                <p className="text-xs font-semibold text-green-900">
                  Total document score
                </p>
                <p className="mt-1 text-2xl font-black text-green-900">
                  {result.score}{" "}
                  <span className="text-base font-semibold text-gray-700">
                    / {result.maximum_score}
                  </span>
                </p>
              </div>

              <div className="text-right text-xs text-slate-500">
                <p>{result.matched_documents} matched</p>
                <p>{result.missing_documents} not matched</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-130 text-left text-sm">  
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-3">Document</th>
                  <th className="px-3 py-3">Requirement</th>
                  <th className="px-3 py-3">Matching</th>
                  <th className="px-3 py-3 text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((item, index) => (
                  <tr
                    key={`${item.scholarship_document_id ?? item.document_name ?? "document"}-${index}`}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-3 py-3 font-semibold text-slate-800">
                      <div className="font-bold text-md">
                        {getDocumentTitle(item)}
                      </div>
                      {item.recommendation && (
                        <p className="mt-1 max-w-xs text-xs font-normal leading-5 text-red-500">
                          <strong>Explanation:</strong> {item.recommendation}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={
                          item.mandatory
                            ? "rounded-full bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700"
                            : "rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-700"
                        }
                      >
                        {item.mandatory ? "Mandatory" : "Optional"}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 ${
                          item.status === "met"
                            ? "text-emerald-700"
                            : "text-rose-600"
                        }`}
                      >
                        {item.status === "met" ? (
                          <CheckCircle2 size={15} />
                        ) : (
                          <CircleX size={15} />
                        )}
                        {item.status === "met" ? "Matched" : "Not matched"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-bold tabular-nums">
                      <div>
                        {item.score ?? 0} / {item.maximum_score ?? 0}
                      </div>
                      <div className="mt-1 text-xs font-medium text-slate-500">
                        {Number(
                          item.percentage ??
                            (item.maximum_score
                              ? (item.score / item.maximum_score) * 100
                              : 0),
                        ).toFixed(2)}
                        %
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-black text-slate-900">
                  <td className="px-3 py-3" colSpan={3}>
                    Total score
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {result.score}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            Matching is based on the student's document checklist declaration.
            It does not verify the authenticity or contents of an uploaded
            document. Every listed scholarship document is evaluated and shown
            separately, including missing mandatory and optional documents.
          </p>
        </div>
      )}
    </section>
  );
}
