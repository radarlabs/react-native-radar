import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: '#DBE5EB',
    borderWidth: 1,
    width: '95%', // only difference between this and the modalInputContainer
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: '#DBE5EB',
    borderWidth: 1,
  },
  inputIcon: {
    marginLeft: 10,
    height: 18,
    width: 18,
    backgroundColor: 'white',
  },
  closeIcon: {
    marginRight: 10,
    height: 18,
    width: 18,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    height: 40,
    fontSize: 14,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  resultListWrapper: {
    width: '100%',
    marginBottom: 30,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingVertical: 8,
  },
  resultList: {
    width: '100%',
  },
  resultItem: {
    paddingRight: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 12,
    backgroundColor: 'white',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinIconContainer: {
    width: 28,
    marginRight: 8,
  },
  pinIcon: {
    height: 26,
    width: 26,
  },
  addressTextContainer: {
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    lineHeight: 24,
    color: '#000',
    fontWeight: '600',
  },
  addressSubtext: {
    fontSize: 14,
    color: '#5A6872',
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginRight: 16,
    alignSelf: 'flex-end',
  },
  footerText: {
    marginTop: 2,
    marginRight: 4,
    fontSize: 10,
    color: '#5A6872',
  },
  logo: {
    width: 50,
    height: 15,
    resizeMode: 'contain',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapLogo: {
    position: 'absolute',
    bottom: -10,
    left: 5,
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});

export default styles;
