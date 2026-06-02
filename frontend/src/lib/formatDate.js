const formatDate = (dateString) => {
  const date = new Date(dateString);

  const options = {
    weekday: 'short',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };

  return date.toLocaleDateString('en-GB', options);
};

export default formatDate;