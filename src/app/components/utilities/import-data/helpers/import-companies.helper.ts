import { Observable } from 'rxjs';
import { Company } from 'src/app/models/company';
import { CompaniesService } from 'src/app/services/companies/companies.service';

export class ImportCompaniesHelper {

  fieldNames: string[];

  constructor(
    private service: CompaniesService
  ) { }

  import(data): Observable<Company[]> {
    const me = this;
    var company: Company,
        companiesToSave: Company[] = [],
        nameIndex,
        descriptionIndex,
        activeIndex;

    me.fieldNames = data[0];
    nameIndex = me.fieldNames.indexOf('Name');
    descriptionIndex = me.fieldNames.indexOf('Description');
    activeIndex = me.fieldNames.indexOf('Active');

    for (var f=1; f<data.length; f++)
    {
      var rowData = data[f];

      company = new Company;
      company.name = rowData[nameIndex];
      company.description = rowData[descriptionIndex];
      company.active = rowData[activeIndex].trim() === 'true' ? true : false;
      company.updated = new Date();
      company.created = new Date();

      companiesToSave.push(company);
    }

    return me.service.createCompanies(companiesToSave);
  }
};