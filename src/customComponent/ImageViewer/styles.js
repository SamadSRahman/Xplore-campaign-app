export const styles = {
    container: {
      width: '100%',
      maxWidth: '1200px',
      // margin: '0 auto',
      // padding: '20px'
    },
    colorSelector: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      marginBottom: '24px',
      flexWrap: 'wrap'
    },
    colorButton: {
      padding: '16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: 'white'
    },
    colorButtonSelected: {
      boxShadow: '0 0 0 2px #2196F3, 0 4px 6px rgba(0,0,0,0.1)'
    },
    colorButtonContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px'
    },
    colorImage: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      objectFit: 'cover',
      cursor: 'pointer'
    },
    colorName: {
      fontSize: '14px',
      color: '#333'
    },
    viewerContainer: {
      width: '100%',
      // aspectRatio: '16/9',
      // backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      cursor: 'grab',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      overflow: 'hidden'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      userSelect: 'none',
      WebkitUserSelect: 'none'
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '300px',
      fontSize: '16px',
      color: '#666'
    }
  };