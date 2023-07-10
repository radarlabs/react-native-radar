import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    padding: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: '#DBE5EB',
    borderWidth: 1,
    marginBottom: 8,
  },
  inputIcon: {
    marginLeft: 10,
    height: 18,
    width: 18,
    backgroundColor: 'white',
    color: 'white',
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
    paddingHorizontal: 16,
  },
  resultList: {
    width: '100%',
  },
  resultItem: {
    paddingRight: 16,
    paddingVertical: 8,
    height: 56,
    fontSize: 12,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinIconContainer: {
    width: 28,
  },
  pinIcon: {
    height: 20,
    width: 20,
    marginRight: 8,
    marginBottom: 14,
  },
  addressTextContainer: {
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  addressSubtext: {
    fontSize: 12,
    color: '#5A6872',
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
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
});
