// const BACKEND_URL = 'https://westernpoultry.thinktankinfotech.com/api';

// // helper to forward auth + cookie headers
// function forwardHeaders(req, extra = {}) {
//   return {
//     cookie: req.headers.get('cookie') || '',
//     authorization: req.headers.get('authorization') || '',  // ← forward token
//     ...extra,
//   };
// }

// export async function GET(req, { params }) {
//   const path = (await params).path.join('/');

//   const backendRes = await fetch(`${BACKEND_URL}/${path}`, {
//     headers: forwardHeaders(req),
//   });

//   const data = await backendRes.json();
//   const res = new Response(JSON.stringify(data), {
//     status: backendRes.status,
//     headers: { 'Content-Type': 'application/json' },
//   });

//   const setCookie = backendRes.headers.get('set-cookie');
//   if (setCookie) res.headers.set('set-cookie', setCookie);
//   return res;
// }

// export async function POST(req, { params }) {
//   const path = (await params).path.join('/');
//   const contentType = req.headers.get('Content-Type') || '';
//   const body = contentType.includes('multipart/form-data')
//     ? await req.blob()
//     : await req.text();

//   const backendRes = await fetch(`${BACKEND_URL}/${path}`, {
//     method: 'POST',
//     headers: forwardHeaders(req, {
//       ...(!contentType.includes('multipart/form-data') && {
//         'Content-Type': contentType,
//       }),
//     }),
//     body,
//   });

//   const data = await backendRes.json();
//   const res = new Response(JSON.stringify(data), {
//     status: backendRes.status,
//     headers: { 'Content-Type': 'application/json' },
//   });

//   const setCookie = backendRes.headers.get('set-cookie');
//   if (setCookie) res.headers.set('set-cookie', setCookie);
//   return res;
// }

// export async function PUT(req, { params }) {
//   const path = (await params).path.join('/');
//   const contentType = req.headers.get('Content-Type') || '';
//   const body = contentType.includes('multipart/form-data')
//     ? await req.blob()
//     : await req.text();

//   const backendRes = await fetch(`${BACKEND_URL}/${path}`, {
//     method: 'PUT',
//     headers: forwardHeaders(req, {
//       ...(!contentType.includes('multipart/form-data') && {
//         'Content-Type': contentType,
//       }),
//     }),
//     body,
//   });

//   const data = await backendRes.json();
//   return new Response(JSON.stringify(data), {
//     status: backendRes.status,
//     headers: { 'Content-Type': 'application/json' },
//   });
// }

// export async function DELETE(req, { params }) {
//   const path = (await params).path.join('/');

//   const backendRes = await fetch(`${BACKEND_URL}/${path}`, {
//     method: 'DELETE',
//     headers: forwardHeaders(req),
//   });

//   const data = await backendRes.json();
//   return new Response(JSON.stringify(data), {
//     status: backendRes.status,
//     headers: { 'Content-Type': 'application/json' },
//   });
// }



const BACKEND_URL = 'https://westernpoultry.thinktankinfotech.com/api';

function forwardHeaders(req, extra = {}) {
  return {
    cookie: req.headers.get('cookie') || '',
    authorization: req.headers.get('authorization') || '',
    ...extra,
  };
}

export async function GET(req, { params }) {
  const path = (await params).path.join('/');

  const backendRes = await fetch(`${BACKEND_URL}/${path}`, {
    headers: forwardHeaders(req),
  });

  const data = await backendRes.json();
  const res = new Response(JSON.stringify(data), {
    status: backendRes.status,
    headers: { 'Content-Type': 'application/json' },
  });

  const setCookie = backendRes.headers.get('set-cookie');
  if (setCookie) res.headers.set('set-cookie', setCookie);
  return res;
}

export async function POST(req, { params }) {
  const path = (await params).path.join('/');
  const contentType = req.headers.get('Content-Type') || '';

  let body;
  let forwardContentType = {};

  if (contentType.includes('multipart/form-data')) {
    // pass formdata as-is — fetch will set correct Content-Type with boundary
    body = await req.formData();
  } else {
    body = await req.text();
    forwardContentType = { 'Content-Type': contentType };
  }

  const backendRes = await fetch(`${BACKEND_URL}/${path}`, {
    method: 'POST',
    headers: forwardHeaders(req, forwardContentType),
    body,
  });

  const data = await backendRes.json();
  const res = new Response(JSON.stringify(data), {
    status: backendRes.status,
    headers: { 'Content-Type': 'application/json' },
  });

  const setCookie = backendRes.headers.get('set-cookie');
  if (setCookie) res.headers.set('set-cookie', setCookie);
  return res;
}

export async function PUT(req, { params }) {
  const path = (await params).path.join('/');
  const contentType = req.headers.get('Content-Type') || '';

  let body;
  let forwardContentType = {};

  if (contentType.includes('multipart/form-data')) {
    // pass formdata as-is — fetch will set correct Content-Type with boundary
    body = await req.formData();
  } else {
    body = await req.text();
    forwardContentType = { 'Content-Type': contentType };
  }

  const backendRes = await fetch(`${BACKEND_URL}/${path}`, {
    method: 'PUT',
    headers: forwardHeaders(req, forwardContentType),
    body,
  });

  const data = await backendRes.json();
  return new Response(JSON.stringify(data), {
    status: backendRes.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function DELETE(req, { params }) {
  const path = (await params).path.join('/');

  const backendRes = await fetch(`${BACKEND_URL}/${path}`, {
    method: 'DELETE',
    headers: forwardHeaders(req),
  });

  const data = await backendRes.json();
  return new Response(JSON.stringify(data), {
    status: backendRes.status,
    headers: { 'Content-Type': 'application/json' },
  });
}