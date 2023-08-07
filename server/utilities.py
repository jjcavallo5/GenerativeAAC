# Constants

DOMAINS = ['https://generativeaac.com', 'http://localhost:3000']
SMALL_PACKAGE_PRICE = 1000
LARGE_PACKAGE_PRICE = 2500
SMALL_PACKAGE_COUNT = 500
LARGE_PACKAGE_COUNT = 1500


def get_price(item):
    '''
    Returns the price of a given item

    Args:
        item - ID of the item

    Returns:
        Price of the item

    '''
    if item == 'smallImagePackage':
        return SMALL_PACKAGE_PRICE
    elif item == 'largeImagePackage':
        return LARGE_PACKAGE_PRICE
    
def handle_cors(request_origin, response):
    '''
    Determines if the request origin is allowed or not

    Args:
        request_origin: origin of the request
        response: response content

    Returns:
        Response with allow origin header if allowed,
        otherwise response without allowed header

    '''
    if request_origin in DOMAINS:
        response.headers.add('Access-Control-Allow-Origin', request_origin)
        return response

    else:
        return response