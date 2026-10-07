export type PayherePayload = { action: string; fields: Record<string, string> };

/** Sends the browser to PayHere's checkout with the signed payment details (a plain form POST, as PayHere requires) */
export function submitToPayhere(payload: PayherePayload) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = payload.action;
  form.style.display = "none";
  for (const [name, value] of Object.entries(payload.fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}
