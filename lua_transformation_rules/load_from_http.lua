
local request = require "http.request"
local cookies = require "http.cookie"
local cjson = require "cjson"

local configuri = "https://blogs.gwbasics.be/requestmatch.json"
local req = request.new_from_uri(configuri)

-- cookie store
-- request has a shared cookie store by default.  So create a new store every time.
req.cookie_store = cookies.new_store()
-- cookie store end

local headers, stream = assert(req:go())

if (headers == nil) or (not headers) then
    Control.returnErrorPage( "1. Could not load configuration data from: "..configuri )
    return
end

local body = assert(stream:get_body_as_string())

if headers:get ":status" ~= "200" then
    Control.returnErrorPage( "2. http error during loading of: "..configuri )
    return
end

if (body == nil) or (not body) then
    Control.returnErrorPage( "3. http error during loading of: "..configuri )
    return
end

-- mmmmmm cookies
local reqCookies = cookies.parse_cookies(headers)
for i,v in ipairs(reqCookies) do
    Control.trace(5, string.format("Cookies : %s - %s",i,v))
end

Control.trace(5, string.format(body))

local thejsonbody = cjson.decode(body)

local req = HTTPRequest.getURL()

for i,v in ipairs(thejsonbody) do

    Control.trace(5, "Access url table element : "..v["url"])

    if string.find(req, v["url"]) then
        HTTPRequest.setHeader("X-LUA-Processed", "Tom Bosmans")
        Control.trace(5, "Found match "..req)
    end
end