
import {
  DOCUMENT_OPTIONS,
  getDocumentCode,
} from "./documentOptions";

const createDocument = () => ({
  document_name: DOCUMENT_OPTIONS[0][0],
  requirement: "",
  condition_text: null,
  mandatory: true,
  source_sentence: null,
});

export default function DocumentRequirements({
  value = [],
  onChange,
}) {
  const documents = Array.isArray(value) ? value : [];

  const update = (index, patch) => {
    if (typeof onChange !== "function") return;

    onChange(
      documents.map((item, i) =>
        i === index ? { ...item, ...patch } : item
      )
    );
  };

  const remove = (index) => {
    if (typeof onChange !== "function") return;

    onChange(documents.filter((_, i) => i !== index));
  };

  const add = () => {
    if (typeof onChange !== "function") return;

    onChange([...documents, createDocument()]);
  };

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-800">
          Required documents
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Choose a readable document name. Its code is saved
          automatically in document_name.
        </p>
      </div>

      {documents.map((document, index) => {
        const documentCode = getDocumentCode(
          document.document_name
        );

        const isKnownDocument = DOCUMENT_OPTIONS.some(
          ([code]) => code === documentCode
        );

        return (
          <div
            key={`${document.id || document.document_name}-${index}`}
            className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">
                Document {index + 1}
              </span>

              <button
                type="button"
                onClick={() => remove(index)}
                className="text-xs font-semibold text-rose-600"
              >
                Remove
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-semibold text-slate-600">
                Document name

                <select
                  value={documentCode}
                  onChange={(e) =>
                    update(index, {
                      document_name: e.target.value,
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-normal text-slate-700"
                >
                  {DOCUMENT_OPTIONS.map(([code, label]) => (
                    <option key={code} value={code}>
                      {label}
                    </option>
                  ))}

                  {documentCode && !isKnownDocument && (
                    <option value={documentCode}>
                      {document.document_name}
                    </option>
                  )}
                </select>

                <span className="mt-1 block font-normal text-slate-400">
                  Stored code: {documentCode || "—"}
                </span>
              </label>

              <label className="text-xs font-semibold text-slate-600">
                Requirement

                <input
                  value={document.requirement || ""}
                  onChange={(e) =>
                    update(index, {
                      requirement: e.target.value,
                    })
                  }
                  placeholder="e.g. Valid passport"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-normal text-slate-700"
                />
              </label>

              <label className="text-xs font-semibold text-slate-600">
                Condition (optional)

                <input
                  value={document.condition_text || ""}
                  onChange={(e) =>
                    update(index, {
                      condition_text: e.target.value || null,
                    })
                  }
                  placeholder="When is this document required?"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-normal text-slate-700"
                />
              </label>

              <label className="text-xs font-semibold text-slate-600">
                Source sentence (optional)

                <input
                  value={document.source_sentence || ""}
                  onChange={(e) =>
                    update(index, {
                      source_sentence: e.target.value || null,
                    })
                  }
                  placeholder="Original wording from the notice"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-normal text-slate-700"
                />
              </label>
            </div>

            <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={document.mandatory !== false}
                onChange={(e) =>
                  update(index, {
                    mandatory: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-slate-300 text-sky-600"
              />

              Mandatory document
            </label>
          </div>
        );
      })}

      <button
        type="button"
        onClick={add}
        className="rounded-xl border border-sky-200 px-4 py-2.5 text-sm font-semibold text-sky-700 hover:bg-sky-50"
      >
        + Add document
      </button>
    </section>
  );
}
