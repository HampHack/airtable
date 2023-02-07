(() => {
  // index.js
  addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
  });
  var createAirtableRecord = (body) => {
    return fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
        AIRTABLE_TABLE_NAME
      )}`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-type": `application/json`,
        },
      }
    );
  };
  var submitHandler = async (request) => {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
      });
    }
    const body = await request.formData();
    const {
      name,
      email,
      phone,
      year,
      institution,
      tshirt,
      accomodations,
      shareData,
    } = Object.fromEntries(body);

    const reqBody = {
      fields: {
        Name: name,
        Email: email,
        Phone: phone,
        Year: year,
        Institution: institution,
        "T-Shirt Size": tshirt,
        Accomodations: accomodations,
        "Share Email": shareData === "on",
      },
    };

    try {
      const res = await createAirtableRecord(reqBody);

      const json = await res.json();

      if (!res.ok) {
        console.log(json.error);
        throw new Error("Failed to create record");
      }
    } catch (err) {
      return new Response(err.message, {
        status: 500,
      });
    }
    return Response.redirect(FORM_URL);
  };
  async function handleRequest(request) {
    const url = new URL(request.url);
    if (url.pathname === "/submit") {
      return submitHandler(request);
    }
    return new Response.redirect(FORM_URL);
  }
})();
//# sourceMappingURL=index.js.map
