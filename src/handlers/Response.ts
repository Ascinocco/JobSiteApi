interface ResponseIFace {
  err?: string;
  body: any;
}

export default function Response(data: ResponseIFace) {
  return {
    err: data.err || false,
    body: data.body,
  };
};