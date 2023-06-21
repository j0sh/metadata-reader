// reader.cpp
// Sample emscripten driver to print the Exif metadata of an image
#include <exiv2/exiv2.hpp>
#include <iostream>
#include <iomanip>
#include <cassert>

#include <emscripten/emscripten.h>
#include <emscripten/val.h>
#include <emscripten/bind.h>

emscripten::val readMetadata(std::string d)
try {
    auto sz = d.length();
    auto data = reinterpret_cast<const Exiv2::byte*>(d.data());
    Exiv2::Image::UniquePtr image = Exiv2::ImageFactory::open(data, sz);
    assert(image.get() != 0);
    image->readMetadata();

    auto result = emscripten::val::object();

    // exif data
    Exiv2::ExifData &exifData = image->exifData();
    if (!exifData.empty()) {
      Exiv2::ExifData::const_iterator end = exifData.end();
      auto exifObj = emscripten::val::object();
      result.set("exif", exifObj);
      for (Exiv2::ExifData::const_iterator i = exifData.begin(); i != end; ++i) {
        /*
        const char* tn = i->typeName();
        std::cout << std::setw(44) << std::setfill(' ') << std::left
                  << i->key() << " "
                  << "0x" << std::setw(4) << std::setfill('0') << std::right
                  << std::hex << i->tag() << " "
                  << std::setw(9) << std::setfill(' ') << std::left
                  << (tn ? tn : "Unknown") << " "
                  << std::dec << std::setw(3)
                  << std::setfill(' ') << std::right
                  << i->count() << "  "
                  << std::dec << i->value()
                  << "\n";
                  */
        exifObj.set(i->key(), i->toString());
      }
    } else std::cout << "No EXIF Data Found" << std::endl;

    // iptc data

    Exiv2::IptcData &iptcData = image->iptcData();
    if (!iptcData.empty()) {
      Exiv2::IptcData::iterator end = iptcData.end();
      auto iptcObj = emscripten::val::object();
      result.set("iptc", iptcObj);
      for (Exiv2::IptcData::iterator md = iptcData.begin(); md != end; ++md) {
        /*
        std::cout << std::setw(44) << std::setfill(' ') << std::left
                  << md->key() << " "
                  << "0x" << std::setw(4) << std::setfill('0') << std::right
                  << std::hex << md->tag() << " "
                  << std::setw(9) << std::setfill(' ') << std::left
                  << md->typeName() << " "
                  << std::dec << std::setw(3)
                  << std::setfill(' ') << std::right
                  << md->count() << "  "
                  << std::dec << md->value()
                  << std::endl;
        */
        iptcObj.set(md->key(), md->toString());
      }
    } else std::cout << "No IPTC Data Found" << std::endl;

    // xmp data
    Exiv2::XmpParser::initialize();
    ::atexit(Exiv2::XmpParser::terminate);
    Exiv2::XmpData &xmpData = image->xmpData();
    if (!xmpData.empty()) {
      auto xmpObj = emscripten::val::object();
      result.set("xmp", xmpObj);
      for (Exiv2::XmpData::const_iterator md = xmpData.begin();
         md != xmpData.end(); ++md) {
      /*
        std::cout << std::setfill(' ') << std::left
                  << std::setw(44)
                  << md->key() << " "
                  << std::setw(9) << std::setfill(' ') << std::left
                  << md->typeName() << " "
                  << std::dec << std::setw(3)
                  << std::setfill(' ') << std::right
                  << md->count() << "  "
                  << std::dec << md->toString()
                  << std::endl;
      */
        // TODO set based on type (eg, bag and seq)
        xmpObj.set(md->key(), md->toString());
      }
    } else std::cout << "No XMP Data Found" << std::endl;
    Exiv2::XmpParser::terminate();

    return result;
}
catch (Exiv2::Error& e) {
    std::cout << "Caught Exiv2 exception '" << e.what() << "'\n";
    return emscripten::val::undefined();
}

using namespace emscripten;
EMSCRIPTEN_BINDINGS(my_module)
{
  function("readMetadata", &readMetadata, allow_raw_pointers());
}
