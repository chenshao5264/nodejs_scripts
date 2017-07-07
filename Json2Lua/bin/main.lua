require "lfs"
require "json"

local num = 0
local luaTable = ""

local function readFile(path)
    local f = assert(io.open(path, 'r'))
    local string = f:read("*all")
    f:close()
    return string
end

local function writeFile(path, str)
    local f = assert(io.open(path, 'w'))
    f:write(str)
    f:close()
end

local function dump_value_(v)
    if type(v) == "string" then
        v = "\"" .. v .. "\""
    end
    return tostring(v)
end

function string.split(input, delimiter)
    input = tostring(input)
    delimiter = tostring(delimiter)
    if (delimiter=='') then return false end
    local pos,arr = 0, {}
    -- for each divider found
    for st,sp in function() return string.find(input, delimiter, pos, true) end do
        table.insert(arr, string.sub(input, pos, st - 1))
        pos = sp + 1
    end
    table.insert(arr, string.sub(input, pos))
    return arr
end

function string.trim(input)
    input = string.gsub(input, "^[ \t\n\r]+", "")
    return string.gsub(input, "[ \t\n\r]+$", "")
end

function formatLuaTable(value)
    local description = ""

    local lookupTable = {}
    local result = {}

    local traceback = string.split(debug.traceback("", 2), "\n")
    print("dump from: " .. string.trim(traceback[3]))

    local function dump_(value, description, indent, nest, keylen)

        local spc = ""
        if type(keylen) == "number" then
            spc = string.rep(" ", keylen - string.len(dump_value_(description)))
        end
        if type(value) ~= "table" then
            result[#result +1 ] = string.format("%s[%s]%s = %s,", indent, dump_value_(description), spc, dump_value_(value))
        elseif lookupTable[tostring(value)] then
            result[#result +1 ] = string.format("%s%s%s = *REF*", indent, dump_value_(description), spc)
        else
            lookupTable[tostring(value)] = true

            if dump_value_(description) == "" then
                return
            end

            local dumpValue = dump_value_(description)
            if dumpValue == '""' then
                result[#result +1 ] = "{"
            else
                result[#result +1 ] = string.format("%s[%s] = {", indent, dumpValue)
            end

            
            local indent2 = indent.."    "
            local keys = {}
            local keylen = 0
            local values = {}
            for k, v in pairs(value) do
                keys[#keys + 1] = k
                local vk = dump_value_(k)
                local vkl = string.len(vk)
                if vkl > keylen then keylen = vkl end
                values[k] = v
            end
            table.sort(keys, function(a, b)
                if type(a) == "number" and type(b) == "number" then
                    return a < b
                else
                    return tostring(a) < tostring(b)
                end
            end)
            for i, k in ipairs(keys) do
                dump_(values[k], k, indent2, nest + 1, keylen)
            end
            result[#result +1] = string.format("%s},", indent)
            
        end
    end
    dump_(value, description, "\n", 1)

    local t = ""
    result[#result] = "\n}"
    for i, line in ipairs(result) do

        t = t ..line
    end
    return t
end

local function convert(jsonName, jsonPath)
    local luaName = jsonName

    print(jsonName .. ".json" .. " >>>>>> " .. luaName .. ".lua")

    local jsonStr = readFile(jsonPath)
    local tab = json.decode(jsonStr)


    local luaHead = "local configTable = "

    local luaTable =  formatLuaTable(tab)

    local luaFoot = "\n\nreturn configTable"

    local path = "./lua/" .. luaName .. ".lua"
    local luaStr = luaHead .. luaTable ..luaFoot 

    writeFile(path, luaStr)
end

local function start(path)
    for fileName in lfs.dir(path) do
        if fileName ~= "." and fileName ~= ".." then
            if string.find(fileName, ".json") ~= nil then
                local filePath = path .. '/' .. fileName
                fileName = string.sub(fileName, 1, string.find(fileName, ".json") - 1)
                print("fileName = " ..fileName)
                print("filePath = " ..filePath)
                convert(fileName, filePath)
                num = num + 1
            end
         end
    end
end

print(">>>>>> Json2Lua（1.0）开始转换 <<<<<<\n")

start("./json")

print("\n>>>>>> 转换 " .. num .." 个文件成功 <<<<<<\n")